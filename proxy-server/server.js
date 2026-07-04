const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
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

    const response = await axios({
      method: 'get',
      url: targetUrl,
      headers: headers,
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
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else if (html.includes('<head ')) {
        html = html.replace(/<head[^>]*>/, match => `${match}${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }
      res.send(html);
    } else {
      res.send(response.data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
