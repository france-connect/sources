const { spawn } = require("child_process");
const fs = require("fs");

// --- Config  -------------
const LOGS_PATH = process.argv[2];

const levelMaps = {
  10: "debug",
  20: "info",
  30: "info",
  40: "warn",
  50: "error",
  60: "error",
  70: "error",
  80: "error",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

const levelColors = {
  debug: "blue",
  log: "green",
  info: "DimGrey",
  warn: "orange",
  error: "red",
};

const geniusColorRoundRobin = [
  "Blue",
  "BlueViolet",
  "Brown",
  "CadetBlue",
  "Chocolate",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGreen",
  "DarkGrey",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DimGray",
  "DimGrey",
  "FireBrick",
  "Indigo",
  "Maroon",
  "MediumBlue",
  "MediumVioletRed",
  "MidnightBlue",
  "Navy",
  "Olive",
  "OliveDrab",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "SeaGreen",
  "Sienna",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "SteelBlue",
  "Teal",
  "Tomato",
];

// --------------------------

// --- Formatting -----------

const awesomeColorCache = {};

function styled(fg, bg, fw = "normal") {
  return [
    "font-size: 11px;",
    `font-weight: ${fw};`,
    "margin: 1px;",
    "padding: 2px;",
    "border-radius: 3px;",
    `color: ${fg};`,
    `background-color: ${bg};`,
  ].join("\n");
}

function formatLogForDebug(entry) {
  const {
    source: sourceProp,
    hostname,
    time,
    level = "info",
    methodName,
    ...data
  } = entry;

  const source = hostname || sourceProp;

  if (!awesomeColorCache[source]) {
    awesomeColorCache[source] = geniusColorRoundRobin.shift();
  }

  const date = new Date(time);
  const dateTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

  const metaStyles = [
    styled("white", awesomeColorCache[source], 900),
    styled("black", "#ccc"),
    styled("white", levelColors[levelMaps[level]]),
    // styled("black", "white"),
  ];

  let meta = [source.toUpperCase(), dateTime, levelMaps[level]];

  if (methodName) {
    meta.push(methodName);
    metaStyles.push(styled("black", "PeachPuff"));
  }

  const mainMsg = data.msg || "";

  // Enhance Business logs display
  if (!mainMsg && data.hasOwnProperty("event")) {
    tagAsBusinessLog(data.event, meta, metaStyles);
  }

  if (!mainMsg && data.hasOwnProperty("type_action")) {
    tagAsBusinessLog(data.type_action, meta, metaStyles);
  }

  return ["%c" + meta.join("%c"), ...metaStyles, mainMsg, data];
}

function tagAsBusinessLog(eventName, meta, styles) {
  styles.push(styled("white", "green", "bold"));
  meta.push(` 🏷️ ${eventName} `);
}
// --------------------------

// --- Handling logs --------
function handleLogData(line) {
  try {
    // Extract JSON part (assuming JSON starts with '{' and ends with '}')
    const jsonParts = line.match(/{.*}/);

    const json = Array.isArray(jsonParts) ? jsonParts[0] : undefined;

    let metaSource = line;
    let isPm2 = false;
    if (json) {
      metaSource = line.replace(json, "").trim();
      isPm2 = true;
    }

    const meta = metaSource
      .split("|")
      .map((m) => m.trim())
      .filter((m) => m);

    const source = isPm2 ? meta[0] : meta[meta.length - 1];

    if (json) {
      try {
        const data = JSON.parse(json.trim());
        data.source = source;

        const formatted = formatLogForDebug(data);

        // Call the native level function to leverage filters in CDT
        let { level } = data;

        if (typeof level === "string") {
          level = level.toLocaleLowerCase();
        }

        if (!level) {
          level = "warn";
        }

        const logFunc = levelMaps[level] || "warn";

        console[logFunc](...formatted);
      } catch (error) {
        console.error("⚠️ Hub error", error);
        console.info(json);
      }
    } else if (line.match(/\[[0-9]+/)) {
      // Detect already styled output
      console.log(line);
    } else {
      console.log("%c>_", styled("white", "black", "bolder"), line);
    }
  } catch (e) {
    console.error("⚠️ Hub error", e, line);
  }
}
// --------------------------

// --- Watch logs ----------
let dockerLogs = {
  kill: () => {},
};

function watchFiles() {
  // Kill any pre-existing process
  dockerLogs.kill(9);

  // Spawn a child process to execute docker-compose log
  const options = {
    stdio: ["ignore", "pipe", "pipe"],
  };
  dockerLogs = spawn(`./tail-logs.sh`, [LOGS_PATH], options);

  let buffer = "";
  // Handle stdout data (new log entries)
  dockerLogs.stdout.on("data", (data) => {
    buffer += data.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep the last partial line in the buffer

    lines.forEach(handleLogData);
  });

  // Handle stderr data (error messages)
  dockerLogs.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  // Handle process close
  dockerLogs.on("close", (code) => {
    console.log(`docker-compose logs process exited with code ${code}`);
  });
}

/**
 * Detect new files in directory
 */
function watchDir() {
  fs.watch(LOGS_PATH, (eventType, fileName) => {
    if (eventType === "rename") {
      const lines = fs.readFileSync(`${LOGS_PATH}/${fileName}`);
      lines.toString().split("\n").forEach(handleLogData);

      // Restart
      watchFiles();
    }
  });
}

watchFiles();
watchDir();
