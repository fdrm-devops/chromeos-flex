import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { TASKBAR_APPS, STAR_MENU_APPS } from '@/lib/constants'

// Base storage atom for opened apps (serializable ID + minimized state)
const openedAppStatesAtom = atomWithStorage<any[]>('chromeos_opened_app_states', []);

export const openedAppsAtom = atom(
  (get) => {
    const states = get(openedAppStatesAtom);
    return states.map(state => {
      const baseApp = STAR_MENU_APPS.find(app => app.id === state.id);
      if (!baseApp) return null;
      return { ...baseApp, isMinimized: state.isMinimized, isFullScreen: state.isFullScreen };
    }).filter(Boolean);
  },
  (get, set, newApps: any) => {
    const resolved = typeof newApps === 'function' ? newApps(get(openedAppsAtom)) : newApps;
    set(openedAppStatesAtom, resolved.map((app: any) => ({ 
      id: app.id, 
      isMinimized: app.isMinimized,
      isFullScreen: app.isFullScreen 
    })));
  }
);

// Base storage atom for shelf app IDs (serializable IDs list)
const shelfAppIdsAtom = atomWithStorage<number[]>('chromeos_shelf_app_ids', TASKBAR_APPS.map(a => a.id));

export const shelfAppsAtom = atom(
  (get) => {
    let ids = get(shelfAppIdsAtom);
    if (!ids.includes(21)) {
      ids = [...ids, 21];
    }
    return ids.map(id => STAR_MENU_APPS.find(app => app.id === id)).filter(Boolean);
  },
  (get, set, newApps: any) => {
    const resolved = typeof newApps === 'function' ? newApps(get(shelfAppsAtom)) : newApps;
    set(shelfAppIdsAtom, resolved.map((app: any) => app.id));
  }
);

export const browserTabsAtom = atomWithStorage<any[]>('chromeos_browser_tabs', [
  { id: 1, title: "Google", url: "https://www.google.com/webhp?igu=1" }
]);

export const activeTabIdAtom = atomWithStorage<any>('chromeos_active_tab_id', 1);