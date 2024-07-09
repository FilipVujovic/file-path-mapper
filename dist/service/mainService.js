"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMapper = RequestMapper;
const ip = "34.8.32.234";
const mappedObject = {};
mappedObject[ip] = [];
const mainObj = mappedObject[ip];
// const data = [
//   "http://34.8.32.234:48183/SvnRep/ADV-H5-New/README.txt",
//   "http://34.8.32.234:48183/SvnRep/ADV-H5-New/VisualSVN.lck",
//   "http://34.8.32.234:48183/SvnRep/ADV-H5-New/hooks-env.tmpl",
//   "http://34.8.32.234:48183/SvnRep/AT-APP/README.txt",
//   "http://34.8.32.234:48183/SvnRep/AT-APP/VisualSVN.lck",
//   "http://34.8.32.234:48183/SvnRep/AT-APP/hooks-env.tmpl",
//   "http://34.8.32.234:48183/SvnRep/README.txt",
//   "http://34.8.32.234:48183/SvnRep/VisualSVN.lck",
//   "http://34.8.32.234:48183/SvnRep/hooks-env.tmpl",
//   "http://34.8.32.234:48183/www/",
//   "http://34.8.32.234:48183/www/README.txt",
//   "http://34.8.32.234:48183/www/README.txt/test1.tmp",
//   "http://34.8.32.234:48183/www/README.txt/test2.tmp",
//   "http://34.8.32.234:48183/www/README.txt/test3.tmp",
//   "http://34.8.32.234:48183/www/VisualSVN.lck",
//   "http://34.8.32.234:48183/www/hooks-env.tmpl",
// ];
const sanitizeUrl = (url) => {
    const domainArray = url.split("/34.8.32.234:48183/")[1].split("/");
    if (url[url.length - 1] === "")
        domainArray.pop();
    return [...domainArray];
};
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (yield fetch("https://rest-test-eight.vercel.app/api/test")).json();
    let items = [];
    if (data.items) {
        items = data.items.map((item) => item.fileUrl);
    }
    return items;
});
const insertMap = new Map();
const addToLevel = (firstLevel, secondLevel, thirdLevel) => {
    if (thirdLevel) {
        mainObj.push({
            [firstLevel]: [
                {
                    [secondLevel]: [thirdLevel],
                },
            ],
        });
    }
    else if (secondLevel) {
        mainObj.push({
            [firstLevel]: [secondLevel],
        });
    }
    else {
        mainObj.push({
            [firstLevel]: [],
        });
    }
    if (secondLevel) {
        /**
         * Dont add duplicates to the map
         */
        if (!insertMap.get(`${firstLevel}/${secondLevel}`)) {
            insertMap.set(`${firstLevel}`, "first");
            insertMap.set(`${firstLevel}/${secondLevel}`, "second");
        }
    }
    else if (firstLevel) {
        if (!insertMap.get(`${firstLevel}`)) {
            insertMap.set(firstLevel, "first");
        }
    }
};
function RequestMapper(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        if (body) {
            data = body;
        }
        else {
            data = yield fetchData();
        }
        for (let i = 0; i < data.length; i++) {
            const res = sanitizeUrl(data[i]);
            const firstLevel = res[0];
            const secondLevel = res[1];
            const thirdLevel = res[2];
            if (res.length === 1 || mainObj.length === 0) {
                //If top level domain is sent || if mainObj is empty && domain is longer than top lvl
                addToLevel(firstLevel, secondLevel, thirdLevel);
            }
            else if (res.length > 1) {
                if (mainObj.length > 0) {
                    //If domain longer than top lvl is sent -> Check if we have it in the object
                    if (!insertMap.get(`${firstLevel}`)) {
                        addToLevel(firstLevel, secondLevel, thirdLevel);
                    }
                    else {
                        mainObj.forEach((topLvlDomain) => {
                            if (firstLevel in topLvlDomain) {
                                if (thirdLevel) {
                                    /**
                                     *   If third level is sent AND we have first level in object
                                     *   Check if second level exists
                                     */
                                    const secondLevelExists = insertMap.get(`${firstLevel}/${secondLevel}`);
                                    if (!secondLevelExists) {
                                        /**
                                         * If second level doesnt exist BUT first exists
                                         * Add to first
                                         */
                                        topLvlDomain[firstLevel].push({
                                            [secondLevel]: [thirdLevel],
                                        });
                                        insertMap.set(`${firstLevel}/${secondLevel}`, "second");
                                    }
                                    else {
                                        /**
                                         * If second level exitst -> Find it in the main object and add third level to it
                                         */
                                        const secondLevelInObject = topLvlDomain[firstLevel].find((sub) => typeof sub === "object" && sub[secondLevel]);
                                        if (secondLevelInObject) {
                                            /**
                                             * If object doesnt exist but second level was created before
                                             */
                                            secondLevelInObject[secondLevel].push(thirdLevel);
                                        }
                                        else {
                                            topLvlDomain[firstLevel].push({
                                                [secondLevel]: [thirdLevel]
                                            });
                                            insertMap.set(`${firstLevel}/${secondLevel}`, 'second');
                                        }
                                    }
                                }
                                else {
                                    /**
                                     * If only second level is sent, not third -> add it to the first level
                                     */
                                    topLvlDomain[firstLevel].push(secondLevel);
                                    insertMap.set(`${firstLevel}/${secondLevel}`, "second");
                                }
                            }
                        });
                    }
                }
            }
        }
        return mappedObject;
    });
}
