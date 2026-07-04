const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.all('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const parsedUrl = new URL(targetUrl);
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': req.headers['accept'] || '*/*',
      'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
    };

    if (req.headers['cookie']) {
      headers['Cookie'] = req.headers['cookie'];
    }
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: headers,
      data: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? req : undefined,
      responseType: 'arraybuffer',
      validateStatus: () => true,
      maxRedirects: 5,
    });

    const responseHeaders = { ...response.headers };

    const headersToStrip = [
      'x-frame-options',
      'content-security-policy',
      'frame-options',
      'cross-origin-resource-policy',
      'cross-origin-embedder-policy',
      'cross-origin-opener-policy',
    ];

    headersToStrip.forEach(header => {
      delete responseHeaders[header];
      delete responseHeaders[header.toUpperCase()];
    });

    if (responseHeaders['set-cookie']) {
      const cookies = responseHeaders['set-cookie'];
      const rewrittenCookies = cookies.map(cookie => {
        return cookie.replace(/Domain=[^;]+;?/gi, '');
      });
      res.setHeader('Set-Cookie', rewrittenCookies);
      delete responseHeaders['set-cookie'];
    }

    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(response.status);

    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html')) {
      let html = response.data.toString('utf8');
      const baseTag = `<base href="${parsedUrl.origin}${parsedUrl.pathname}">`;
      const interceptScript = `
<script>
(function() {
  const targetUrl = new URL(window.location.href).searchParams.get('url');
  if (!targetUrl) return;
  const targetOrigin = new URL(targetUrl).origin;

  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    let url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
    if (url.startsWith('/') && !url.startsWith('//')) {
      url = targetOrigin + url;
    }
    if (url.startsWith('http') && !url.includes(window.location.host)) {
      const proxiedUrl = window.location.origin + '/proxy?url=' + encodeURIComponent(url);
      if (input instanceof Request) {
        const newReq = new Request(proxiedUrl, input);
        return originalFetch(newReq, init);
      }
      return originalFetch(proxiedUrl, init);
    }
    return originalFetch(input, init);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    let resolvedUrl = url;
    if (typeof url === 'string') {
      if (url.startsWith('/') && !url.startsWith('//')) {
        resolvedUrl = targetOrigin + url;
      }
      if (resolvedUrl.startsWith('http') && !resolvedUrl.includes(window.location.host)) {
        resolvedUrl = window.location.origin + '/proxy?url=' + encodeURIComponent(resolvedUrl);
      }
    }
    return originalOpen.apply(this, [method, resolvedUrl, ...args]);
  };

  const originalReplace = window.history.replaceState;
  window.history.replaceState = function(state, unused, url) {
    try {
      if (url) {
        let targetStr = String(url);
        if (targetStr.startsWith('http')) {
          const parsed = new URL(targetStr);
          if (parsed.origin === targetOrigin) {
            const newUrl = window.location.origin + window.location.pathname + '?url=' + encodeURIComponent(targetStr);
            return originalReplace.apply(this, [state, unused, newUrl]);
          }
        }
      }
      return originalReplace.apply(this, arguments);
    } catch (e) {
      console.warn(e);
    }
  };

  const originalPush = window.history.pushState;
  window.history.pushState = function(state, unused, url) {
    try {
      if (url) {
        let targetStr = String(url);
        if (targetStr.startsWith('http')) {
          const parsed = new URL(targetStr);
          if (parsed.origin === targetOrigin) {
            const newUrl = window.location.origin + window.location.pathname + '?url=' + encodeURIComponent(targetStr);
            return originalPush.apply(this, [state, unused, newUrl]);
          }
        }
      }
      return originalPush.apply(this, arguments);
    } catch (e) {
      console.warn(e);
    }
  };
})();
</script>
`;

      const injectedContent = baseTag + interceptScript;
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${injectedContent}`);
      } else if (html.includes('<head ')) {
        html = html.replace(/<head[^>]*>/, match => `${match}${injectedContent}`);
      } else {
        html = `${injectedContent}${html}`;
      }
      res.send(html);
    } else {
      res.send(response.data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
