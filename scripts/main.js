const timeFrameButtons = document.querySelectorAll("input[name='timeframe']");
const selectedTimeFrameButton = document.querySelector(
  "input[name='timeframe']:checked",
);

let isFirstLoad = true;
let liveRegionDebounce = undefined;
let liveRegionTimeout = undefined;

function showInitialStats(stats, timeFrame) {
  const activityContainer = document.querySelector(".activity-wrapper");

  for (const stat of stats) {
    const activity = document.createElement("div");
    const activityStats = document.createElement("div");
    const activityTypeContainer = document.createElement("div");
    const activityType = document.createElement("h3");
    const actionButton = document.createElement("button");
    const actionButtonSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    const actionButtonSVGPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    const actionMenu = document.createElement("ul");
    const actionList = document.createElement("li");
    const activityTimeContainer = document.createElement("div");
    const currentTimeWrapper = document.createElement("p");
    const currentSRLabel = document.createElement("span");
    const currentTimeEl = document.createElement("time");
    const currentTimeVisual = document.createElement("span");
    const currentTimeSR = document.createElement("span");
    const previousTimeWrapper = document.createElement("p");
    const previousSRLabel = document.createElement("span");
    const previousTimeEl = document.createElement("time");
    const previousTimeVisual = document.createElement("span");
    const previousTimeSR = document.createElement("span");

    activity.classList.add(
      `activity-${stat.title.replace(" ", "-").toLowerCase()}`,
    );
    activity.classList.add("activity-card");

    activityStats.classList.add("activity-stats");

    activityTypeContainer.classList.add("activity-type");

    activityType.textContent = stat.title;

    actionButton.setAttribute("type", "button");
    actionButton.setAttribute("aria-expanded", "false");
    actionButton.setAttribute("aria-haspopup", "menu");
    actionButton.setAttribute(
      "aria-controls",
      `action-menu-${stat.title.replace(" ", "-").toLowerCase()}`,
    );
    actionButton.setAttribute("aria-label", "More actions");

    actionButtonSVG.setAttribute("aria-hidden", "true");
    actionButtonSVG.setAttribute("width", "21");
    actionButtonSVG.setAttribute("height", "5");
    actionButtonSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    actionButtonSVGPath.setAttribute(
      "d",
      "M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
    );
    actionButtonSVGPath.setAttribute("fill", "#BBC0FF");
    actionButtonSVGPath.setAttribute("fill-rule", "evenodd");

    actionButtonSVG.appendChild(actionButtonSVGPath);
    actionButton.appendChild(actionButtonSVG);

    actionMenu.setAttribute(
      "id",
      `action-menu-${stat.title.replace(" ", "-").toLowerCase()}`,
    );
    actionMenu.setAttribute("role", "menu");
    actionMenu.setAttribute("aria-label", "Action Menu");

    actionList.setAttribute("role", "menuitem");

    actionMenu.appendChild(actionList);

    activityTypeContainer.append(activityType, actionButton, actionMenu);

    currentSRLabel.classList.add("sr-only");

    currentSRLabel.textContent =
      timeFrame === "daily"
        ? "Today Total Time Spent - "
        : `This ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)} Total Time Spent - `;

    currentTimeEl.setAttribute(
      "datetime",
      `PT${stat.timeframes[timeFrame].current}H`,
    );
    currentTimeEl.classList.add(`js${stat.title.replace(" ", "")}CurrentTime`);
    currentTimeVisual.setAttribute("aria-hidden", "true");
    currentTimeVisual.textContent = `${stat.timeframes[timeFrame].current}hrs`;
    currentTimeSR.classList.add("sr-only");
    currentTimeSR.textContent = `${stat.timeframes[timeFrame].current} hours`;

    currentTimeEl.appendChild(currentTimeVisual);
    currentTimeEl.appendChild(currentTimeSR);
    currentTimeWrapper.appendChild(currentSRLabel);
    currentTimeWrapper.appendChild(currentTimeEl);

    previousSRLabel.classList.add("sr-only");
    previousSRLabel.textContent = "Total Time Spent";
    previousTimeEl.setAttribute(
      "datetime",
      `PT${stat.timeframes[timeFrame].previous}H`,
    );
    previousTimeEl.classList.add(
      `js${stat.title.replace(" ", "")}PreviousTime`,
    );
    previousTimeVisual.setAttribute("aria-hidden", "true");
    previousTimeVisual.textContent = `${stat.timeframes[timeFrame].previous}hrs`;
    previousTimeSR.classList.add("sr-only");
    previousTimeSR.textContent = `${stat.timeframes[timeFrame].previous} hours`;

    let timeFrameLabel =
      timeFrame === "daily"
        ? "Yesterday"
        : `Last ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)}`;

    previousTimeEl.appendChild(previousTimeVisual);
    previousTimeEl.appendChild(previousTimeSR);
    previousTimeWrapper.append(
      `${timeFrameLabel} `,
      previousSRLabel,
      " - ",
      previousTimeEl,
    );

    activityTimeContainer.classList.add("activity-time");
    activityTimeContainer.appendChild(currentTimeWrapper);
    activityTimeContainer.appendChild(previousTimeWrapper);

    activityStats.appendChild(activityTypeContainer);
    activityStats.appendChild(activityTimeContainer);

    activity.appendChild(activityStats);
    activityContainer.appendChild(activity);

    isFirstLoad = false;
  }
}

function updateStats(stats, timeFrame) {
  const liveRegionEl = document.querySelector("p[aria-live='polite']");

  for (const stat of stats) {
    const currentTimeLabel = document.querySelector(
      `.activity-${stat.title.replace(" ", "-").toLowerCase()} .activity-time p:first-child`,
    );

    const previousTimeLabel = document.querySelector(
      `.activity-${stat.title.replace(" ", "-").toLowerCase()} .activity-time p:last-child`,
    );

    // Alternative
    // if (currentTimeLabel.firstElementChild.nodeType === Node.ELEMENT_NODE) {
    //   currentTimeLabel.firstElementChild.textContent =
    //     timeFrame === "daily"
    //       ? "Today Total Time Spent - "
    //       : `This ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)} Total Time Spent - `;
    // }

    // if (previousTimeLabel.firstChild.nodeType === Node.TEXT_NODE) {
    //   previousTimeLabel.firstChild.textContent =
    //     timeFrame === "daily"
    //       ? "Yesterday "
    //       : `Last ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)} `;
    // }

    if (currentTimeLabel.childNodes[0].nodeType === Node.ELEMENT_NODE) {
      currentTimeLabel.childNodes[0].textContent =
        timeFrame === "daily"
          ? "Today Total Time Spent - "
          : `This ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)} Total Time Spent - `;
    }

    if (previousTimeLabel.childNodes[0].nodeType === Node.TEXT_NODE) {
      previousTimeLabel.childNodes[0].textContent =
        timeFrame === "daily"
          ? "Yesterday "
          : `Last ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1, -2)} `;
    }

    const currentTimeSrHidden = document.querySelector(
      `.js${stat.title.replace(" ", "")}CurrentTime  span:first-child`,
    );
    const currentTimeSrOnly = document.querySelector(
      `.js${stat.title.replace(" ", "")}CurrentTime  span:last-child`,
    );

    const previousTimeSrHidden = document.querySelector(
      `.js${stat.title.replace(" ", "")}PreviousTime  span:first-child`,
    );
    const previousTimeSrOnly = document.querySelector(
      `.js${stat.title.replace(" ", "")}PreviousTime  span:last-child`,
    );

    currentTimeSrHidden.textContent = `${stat.timeframes[timeFrame].current}hrs`;
    currentTimeSrOnly.textContent = `${stat.timeframes[timeFrame].current} hours`;

    previousTimeSrHidden.textContent = `${stat.timeframes[timeFrame].previous}hrs`;
    previousTimeSrOnly.textContent = `${stat.timeframes[timeFrame].previous} hours`;
  }

  // Clear existing timers if the user is still selecting other button before the callback function in the timer get executed
  if (liveRegionDebounce) {
    clearTimeout(liveRegionDebounce);
  }

  if (liveRegionTimeout) {
    clearTimeout(liveRegionTimeout);
  }

  // Set live region announcement text (debounce - wait for the user to stop select radio button / settle on a choice before triggering live announcement)
  liveRegionDebounce = setTimeout(() => {
    liveRegionEl.textContent = `Dashboard updated with ${timeFrame} activity time.`;

    // Clear the live region after a short duration
    liveRegionTimeout = setTimeout(() => {
      liveRegionEl.textContent = "";
    }, 6000);
  }, 500);
}

async function fetchActivityStats(selectedTimeFrame) {
  try {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    isFirstLoad
      ? showInitialStats(data, selectedTimeFrame.value)
      : updateStats(data, selectedTimeFrame.value);
  } catch (error) {
    console.error(`Could not get activity stats: ${error.message}`);
  }
}

timeFrameButtons.forEach((timeFrameButton) => {
  timeFrameButton.addEventListener("change", (event) => {
    if (event.target.checked) {
      fetchActivityStats(event.target);
    }
  });
});

fetchActivityStats(selectedTimeFrameButton);
