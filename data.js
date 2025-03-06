export const svgConfigsMap = new Map([
  [
    "Sec1",
    new Map([
      [
        "Sector32",
        {
          row_count: 7,
          col_count: 11,
          spacingX: 50,
          spacingY: 50,
          radius: 15,
          rows: [
            new Map([
              [
                ["config", { rowName: "A", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"], ["4"]])],
              ],
              [
                ["config", { rowName: "B", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"], ["4"], ["5"]])],
              ],
              [
                ["config", { rowName: "C", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"], ["4"], ["5"], ["6"]])],
              ],
            ]),
          ],
        },
      ],
    ]),
  ],
  [
    "Sec2",
    new Map([
      [
        "Sector33",
        {
          row_count: 6,
          col_count: 8,
          spacingX: 50,
          spacingY: 50,
          radius: 15,
          rows: [
            new Map([
              [
                ["config", { rowName: "X", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"]])],
              ],
              [
                ["config", { rowName: "Y", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"], ["4"]])],
              ],
              [
                ["config", { rowName: "Z", align: "right" }],
                ["cols", new Map([["1"], ["2"], ["3"], ["4"], ["5"]])],
              ],
            ]),
          ],
        },
      ],
    ]),
  ],
]);
