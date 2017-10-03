
export class Utils {
    
    public static buildQueryString(params: any): string {
        let queryString = "";
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                queryString += key + "=" + params[key] + "&";
            }
        }
        return encodeURI(queryString.slice(0, -1));
    }

    public static guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
}