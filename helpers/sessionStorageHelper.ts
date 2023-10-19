const sessionStorageHelper = {
    getItem<T>(key: string): T | null {
        try {
            if (typeof window !== undefined) {
                const value = window.sessionStorage.getItem(key);
                const ngValue = window.sessionStorage.getItem(`ng-${key}`);
                const returnValue = value || ngValue || "";
                return JSON.parse(returnValue || "");
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    },
    setItem<T>(key: string, value: T): void {
        try {
            if (typeof window !== undefined) {
                if (typeof value === 'number') {
                    window.sessionStorage.setItem(key, JSON.stringify(value));
                } else {
                    window.sessionStorage.setItem(key, JSON.stringify(value || null));
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    removeItem(key: string): void {
        try {
            if (typeof window !== undefined) {
                window.sessionStorage.removeItem(key);
            }
        } catch (err) {
            console.log(err);
        }
    },
    removeItemsWithPattern(pattern: string): void {
        try {
            if (typeof window !== undefined) {
                let sessionStorageLen = window.sessionStorage.length;
                let sessionStorageKey;
                const regex = new RegExp(pattern);
                while (sessionStorageLen--) {
                    sessionStorageKey = window.sessionStorage.key(sessionStorageLen) || "";
                    if (regex.test(sessionStorageKey)) {
                        this.removeItem(sessionStorageKey);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};

export default sessionStorageHelper;
