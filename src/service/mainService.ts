interface FileStructure {
  [ipAddress: string]: Directory[];
}

interface Directory {
  [directoryName: string]: (SubDirectory | string)[];
}

interface SubDirectory {
  [subDirName: string]: string[];
}

const sanitizeUrl = (url: string): string[] => {
  const domainArray: string[] = url.split("/34.8.32.234:48183/")[1].split("/");
  if (url[url.length - 1] === "") domainArray.pop();

  return [...domainArray];
};

const fetchData = async () => {
  const data = await (
    await fetch("https://rest-test-eight.vercel.app/api/test")
  ).json();
  let items = [];
  if (data.items) {
    items = data.items.map((item: { fileUrl: string }) => item.fileUrl);
  }
  return items;
};


const addToLevel = (
  mainObj: Directory[],
  firstLevel: string,
  secondLevel: string,
  thirdLevel: string,
  insertMap: Map<string, string>
) => {
  if (thirdLevel) {
    mainObj.push({
      [firstLevel]: [
        {
          [secondLevel]: [thirdLevel],
        },
      ],
    });
  } else if (secondLevel) {
    mainObj.push({
      [firstLevel]: [secondLevel],
    });
  } else {
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
  } else if (firstLevel) {
    if (!insertMap.get(`${firstLevel}`)) {
      insertMap.set(firstLevel, "first");
    }
  }
};

export async function RequestMapper(body? : string[]) {
  const mappedObject: FileStructure = {};
  const mainObj: Directory[] = [];

  let data = [];
  if(body) {
    data = body
  } else {
    data = await fetchData();
  }

  const insertMap = new Map();

  for (let i = 0; i < data.length; i++) {
    const res = sanitizeUrl(data[i]);
    const firstLevel = res[0];
    const secondLevel = res[1];
    const thirdLevel = res[2];

      if (res.length === 1 || mainObj.length === 0) {
        //If top level domain is sent || if mainObj is empty && domain is longer than top lvl
        addToLevel(mainObj, firstLevel, secondLevel, thirdLevel, insertMap);
      } else if (res.length > 1) {
        if (mainObj.length > 0) {
          //If domain longer than top lvl is sent -> Check if we have it in the object
          if (!insertMap.get(`${firstLevel}`)) {
            addToLevel(mainObj, firstLevel, secondLevel, thirdLevel, insertMap);
          } else {
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
                  } else {
                    /**
                     * If second level exitst -> Find it in the main object and add third level to it
                     */
                    const secondLevelInObject = topLvlDomain[firstLevel].find((sub: string | SubDirectory) =>typeof sub === "object" && sub[secondLevel]) as SubDirectory;

                    if(secondLevelInObject) {
                      /**
                       * If object doesnt exist but second level was created before
                       */
                      secondLevelInObject[secondLevel].push(thirdLevel);
                    } else {
                      topLvlDomain[firstLevel].push({
                        [secondLevel]: [thirdLevel]
                      });
                      insertMap.set(`${firstLevel}/${secondLevel}`, 'second');
                    }
                  }
                } else {
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
  mappedObject["34.8.32.234"] = mainObj;
  return mappedObject;
}
