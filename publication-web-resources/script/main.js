var currentPage = 0;
const totalHtmlFiles = 152;
const pageSize = { width: 1008, height: 720 };
const shareBaseUrl = "https://www.freedomseries.ai/riseofsibook";
const searchIndexUrl = "publication-web-resources/search/index.json";
var searchIndex = null;
var searchLoading = null;
const lastPageStorageKey = "riseofsi-last-page";
function pageNumberToFileIndex(pageNumber) {
	return Math.floor(pageNumber / 2);
}
const tocSections = [
	{
		title: "Chapter 1",
		open: false,
		items: [
			{ title: "An Unprecedented Revolution", page: 14 },
			{ title: "Brief History of AGI", page: 18 },
			{ title: "A Cambrian Explosion in Robotics", page: 26 },
			{ title: "Accelerate Everything", page: 32 },
			{ title: "First Encounters: Lessons from the Social Media Frontier", page: 44 },
			{ title: "The Alignment Problem", page: 50 },
			{ title: "Military Use and the Global Landscape", page: 56 },
			{ title: "The Specter of Misuse", page: 64 },
			{ title: "Inequality and the Economic Transformation", page: 68 },
			{ title: "Utopian Dreams to Dystopian Nightmares", page: 72 },
			{ title: "A Vision for Collective Action", page: 80 }
		]
	},
	{
		title: "Chapter 2",
		open: false,
		items: [
			{ title: "A Guiding Vision for the Future", page: 86 },
			{ title: "The Four Pillars of Freedom", page: 90 },
			{ title: "Freedom as a Journey: An Infinite Horizon", page: 96 },
			{ title: "Interdependence of the Four Aspects", page: 102 },
			{ title: "Bridging Individual and Collective Well-being", page: 114 },
			{ title: "Free Energy Principle: Evolution and Intelligence", page: 124 },
			{ title: "Freedom in Philosophy, Religion, and Mysticism", page: 130 },
			{ title: "The Universal Allure of Freedom", page: 142 },
			{ title: "Unifying Liberalism and Realism", page: 148 },
			{ title: "An Open Horizon", page: 154 }
		]
	},
	{
		title: "Chapter 3",
		open: false,
		items: [
			{ title: "From Transactions to Transformation", page: 162 },
			{ title: "Reshaping the Purpose of Economy", page: 168 },
			{ title: "Quantifying Alignment", page: 176 },
			{ title: "Grounding Ethics in Shared Values", page: 182 },
			{ title: "Scaling Collected Intelligence", page: 192 },
			{ title: "Implementation Challenges", page: 202 },
			{ title: "Playing Monopoly with Henry George", page: 206 },
			{ title: "Beyond Basic Income", page: 214 },
			{ title: "Internalizing Externalities", page: 220 },
			{ title: "A New Social Contract", page: 226 }
		]
	},
	{
		title: "Chapter 4",
		open: false,
		items: [
			{ title: "Exploring Possible Futures", page: 236 },
			{ title: "A Modern Interpretation of Asimov's Laws", page: 250 },
			{ title: "Universal, Group, and Individual", page: 260 },
			{ title: "Humanity's Role in the Age of Superintelligence", page: 264 },
			{ title: "Trust is an Art of Letting Go", page: 274 },
			{ title: "The Ship of Theseus", page: 278 },
			{ title: "Neverending Questions", page: 286 },
			{ title: "Conclusion: A World Worth Creating", page: 290 }
		]
	}
];
function fitContentToFrame() {
	var iframe = document.getElementById("contentIFrame");
	var frame = document.querySelector(".reader-frame");
	var outline = document.querySelector(".page-outline");
	if (!iframe || !frame) {
		return;
	}
	var frameRect = frame.getBoundingClientRect();
	var scale = Math.min(frameRect.width / pageSize.width, frameRect.height / pageSize.height);
	var offsetLeft = (frameRect.width - pageSize.width * scale) / 2;
	var offsetTop = (frameRect.height - pageSize.height * scale) / 2;
	iframe.style.width = pageSize.width + "px";
	iframe.style.height = pageSize.height + "px";
	iframe.style.transformOrigin = "top left";
	iframe.style.transform = "scale(" + scale + ")";
	iframe.style.left = Math.max(0, offsetLeft) + "px";
	iframe.style.top = Math.max(0, offsetTop) + "px";
	iframe.setAttribute("scrolling", "no");
	if (outline) {
		outline.style.width = pageSize.width + "px";
		outline.style.height = pageSize.height + "px";
		outline.style.left = Math.max(0, offsetLeft) + "px";
		outline.style.top = Math.max(0, offsetTop) + "px";
		outline.style.transformOrigin = "top left";
		outline.style.transform = "scale(" + scale + ")";
	}
}
window.addEventListener("resize", fitContentToFrame);
function updateCoverState() {
	if (currentPage === 0) {
		document.body.classList.add("cover-spread");
	} else {
		document.body.classList.remove("cover-spread");
	}
}
document.addEventListener("keydown", function (event) {
	if (event.key === "ArrowRight") {
		showNextPage();
	}
	if (event.key === "ArrowLeft") {
		showPreviousPage();
	}
});
window.addEventListener("load", function () {
	var prevZone = document.querySelector(".page-click-prev");
	var nextZone = document.querySelector(".page-click-next");
	var tocToggle = document.querySelector(".toc-toggle-hit");
	var tocList = document.getElementById("tocList");
	var pageInput = document.getElementById("pageInput");
	var copyLinkButton = document.getElementById("copyLinkButton");
	var searchInput = document.getElementById("searchInput");
	var toggleSearchButton = document.getElementById("toggleSearchButton");
	var searchCloseButton = document.getElementById("searchCloseButton");
	if (prevZone) {
		prevZone.addEventListener("click", showPreviousPage);
	}
	if (nextZone) {
		nextZone.addEventListener("click", showNextPage);
	}
	if (tocToggle) {
		tocToggle.addEventListener("click", function () {
			document.body.classList.toggle("toc-open");
		});
	}
	if (pageInput) {
		pageInput.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				jumpToPageNumber();
			}
		});
	}
	if (copyLinkButton) {
		copyLinkButton.addEventListener("click", function () {
			copyPageLink();
		});
	}
	if (searchInput) {
		searchInput.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				runSearch();
			}
		});
	}
	if (toggleSearchButton) {
		toggleSearchButton.addEventListener("click", function () {
			var isOpen = document.body.classList.contains("search-open");
			if (isOpen) {
				document.body.classList.remove("search-open");
				toggleSearchButton.classList.remove("active");
			} else {
				document.body.classList.add("search-open");
				toggleSearchButton.classList.add("active");
				if (searchInput) {
					searchInput.focus();
				}
			}
		});
	}
	if (searchCloseButton) {
		searchCloseButton.addEventListener("click", function () {
			document.body.classList.remove("search-open");
			if (toggleSearchButton) {
				toggleSearchButton.classList.remove("active");
			}
		});
	}
	if (tocList) {
		tocSections.forEach(function (section, index) {
			var sectionWrap = document.createElement("div");
			sectionWrap.className = "toc-section";
			if (index === tocSections.length - 1) {
				sectionWrap.classList.add("toc-section-last");
			}
			if (section.open) {
				sectionWrap.classList.add("open");
			}
			var header = document.createElement("button");
			header.type = "button";
			header.className = "toc-section-toggle";
			header.textContent = section.title;
			header.addEventListener("click", function () {
				var isOpen = sectionWrap.classList.contains("open");
				document.querySelectorAll(".toc-section.open").forEach(function (openSection) {
					openSection.classList.remove("open");
				});
				if (!isOpen) {
					sectionWrap.classList.add("open");
				}
			});
			var list = document.createElement("div");
			list.className = "toc-section-list";
			section.items.forEach(function (entry) {
				var item = document.createElement("div");
				item.className = "toc-item";
				item.innerHTML =
					"<span class=\"toc-title\">" + entry.title + "</span>" +
					"<span class=\"toc-page\">" + entry.page + "</span>";
			item.addEventListener("click", function () {
				currentPage = pageNumberToFileIndex(entry.page);
				changePublication();
				showHideArrows();
				fitContentToFrame();
				document.body.classList.remove("toc-open");
			});
				if (entry === section.items[section.items.length - 1]) {
					item.classList.add("toc-item-last");
				}
				list.appendChild(item);
			});
			sectionWrap.appendChild(header);
			sectionWrap.appendChild(list);
			tocList.appendChild(sectionWrap);
		});
	}
	applyInitialPageFromQuery();
	updateCoverState();
});
function setSearchStatus(message) {
	var status = document.getElementById("searchStatus");
	if (status) {
		status.textContent = message;
	}
}
function renderSearchResults(results) {
	var resultsWrap = document.getElementById("searchResults");
	if (!resultsWrap) {
		return;
	}
	resultsWrap.innerHTML = "";
	results.forEach(function (result) {
		var item = document.createElement("div");
		item.className = "search-result";
		item.innerHTML =
			"<span class=\"search-snippet\">" + result.snippet + "</span>" +
			"<span class=\"search-page\">" + result.pageLabel + "</span>";
		item.addEventListener("click", function () {
			applyPageNumber(result.pageNumber, false);
			document.body.classList.remove("toc-open");
		});
		resultsWrap.appendChild(item);
	});
	if (results.length > 0) {
		document.body.classList.add("search-has-results");
	} else {
		document.body.classList.remove("search-has-results");
	}
}
async function loadSearchIndex() {
	if (searchIndex) {
		return searchIndex;
	}
	if (searchLoading) {
		return searchLoading;
	}
	searchLoading = (async function () {
		try {
			var response = await fetch(searchIndexUrl, { cache: "no-store" });
			if (!response.ok) {
				return null;
			}
			return await response.json();
		} catch (error) {
			return null;
		}
	})();
	searchIndex = await searchLoading;
	return searchIndex;
}
async function runSearch() {
	var input = document.getElementById("searchInput");
	if (!input) {
		return;
	}
	var query = input.value.trim().toLowerCase();
	if (!query) {
		renderSearchResults([]);
		setSearchStatus("Enter a word or phrase.");
		document.body.classList.remove("search-has-results");
		return;
	}
	setSearchStatus("Searching...");
	var index = await loadSearchIndex();
	if (!index) {
		setSearchStatus("Search index unavailable.");
		document.body.classList.remove("search-has-results");
		return;
	}
	var results = [];
	for (var i = 0; i < index.length; i++) {
		var entry = index[i];
		if (!entry || !entry.text) {
			continue;
		}
		var matchIndex = entry.text.indexOf(query);
		if (matchIndex === -1) {
			continue;
		}
		var raw = entry.rawText || entry.text;
		var start = Math.max(0, matchIndex - 40);
		var end = Math.min(raw.length, matchIndex + 60);
		var snippet = raw.slice(start, end).replace(/\s+/g, " ").trim();
		var pageLabel = entry.pageNumber === 0
			? "Cover"
			: entry.pageNumber + "-" + (entry.pageNumber + 1);
		results.push({
			pageNumber: entry.pageNumber,
			pageLabel: pageLabel,
			snippet: snippet || "Match"
		});
		if (results.length >= 30) {
			break;
		}
	}
	if (results.length === 0) {
		renderSearchResults([]);
		setSearchStatus("No matches found.");
		document.body.classList.remove("search-has-results");
		return;
	}
	renderSearchResults(results);
	setSearchStatus("Showing " + results.length + " result(s).");
}
function readPageParamFromUrl(urlString) {
	if (!urlString) {
		return null;
	}
	try {
		var url = new URL(urlString);
		var param = url.searchParams.get("page");
		if (param) {
			return param;
		}
		if (url.hash) {
			var hash = url.hash.replace(/^#/, "");
			if (hash.indexOf("page=") === 0) {
				return hash.replace("page=", "");
			}
		}
	} catch (error) {
		return null;
	}
	return null;
}
function applyInitialPageFromQuery() {
	var pageParam = readPageParamFromUrl(window.location.href);
	if (!pageParam && document.referrer) {
		pageParam = readPageParamFromUrl(document.referrer);
	}
	if (!pageParam) {
		var storedPage = getStoredPageNumber();
		if (storedPage !== null) {
			applyPageNumber(storedPage, false);
		}
		return;
	}
	applyPageNumber(pageParam, true);
}
function getStoredPageNumber() {
	try {
		var value = window.localStorage.getItem(lastPageStorageKey);
		if (!value) {
			return null;
		}
		var pageNumber = Number(value);
		if (Number.isNaN(pageNumber)) {
			return null;
		}
		return pageNumber;
	} catch (error) {
		return null;
	}
}
function storePageNumber(pageNumber) {
	try {
		window.localStorage.setItem(lastPageStorageKey, String(pageNumber));
	} catch (error) {
	}
}
function applyPageNumber(rawPage, showStatus) {
	var pageNumber = Number(rawPage);
	var maxPageNumber = (totalHtmlFiles - 1) * 2;
	if (Number.isNaN(pageNumber)) {
		return;
	}
	pageNumber = Math.max(0, Math.min(maxPageNumber, Math.floor(pageNumber)));
	storePageNumber(pageNumber);
	currentPage = pageNumberToFileIndex(pageNumber);
	changePublication();
	showHideArrows();
	fitContentToFrame();
	if (showStatus) {
		setPageStatus("Showing page " + pageNumber + ".");
	}
}
function getCurrentPageLink() {
	var pageNumber = currentPage * 2;
	if (!shareBaseUrl) {
		return window.location.origin + window.location.pathname + "?page=" + pageNumber;
	}
	return shareBaseUrl + "?page=" + pageNumber;
}

window.addEventListener("message", function (event) {
	if (!event || !event.data) {
		return;
	}
	var payload = event.data;
	if (typeof payload === "string") {
		try {
			payload = JSON.parse(payload);
		} catch (error) {
			payload = null;
		}
	}
	if (!payload || payload.type !== "riseofsi-page") {
		return;
	}
	applyPageNumber(payload.page, false);
});
async function copyPageLink() {
	var link = getCurrentPageLink();
	if (!link) {
		setPageStatus("No page link available.");
		return;
	}
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(link);
			setPageStatus("Link copied.");
			return;
		}
	} catch (error) {
	}
	var temp = document.createElement("textarea");
	temp.value = link;
	temp.setAttribute("readonly", "");
	temp.style.position = "absolute";
	temp.style.left = "-9999px";
	document.body.appendChild(temp);
	temp.select();
	try {
		document.execCommand("copy");
		setPageStatus("Link copied.");
	} catch (error) {
		setPageStatus("Copy failed.");
	}
	document.body.removeChild(temp);
}
function setPageStatus(message) {
	var status = document.getElementById("pageStatus");
	if (status) {
		status.textContent = message;
	}
}
function jumpToPageNumber() {
	var input = document.getElementById("pageInput");
	if (!input) {
		return;
	}
	var raw = input.value.trim();
	var pageNumber = Number(raw);
	var maxPageNumber = (totalHtmlFiles - 1) * 2;
	if (!raw || Number.isNaN(pageNumber)) {
		setPageStatus("Enter a valid page number.");
		return;
	}
	pageNumber = Math.floor(pageNumber);
	if (pageNumber < 0) {
		setPageStatus("Page out of range (0-" + maxPageNumber + ").");
		return;
	}
	if (pageNumber > maxPageNumber) {
		pageNumber = maxPageNumber;
	}
	input.value = pageNumber;
	currentPage = pageNumberToFileIndex(pageNumber);
	changePublication();
	showHideArrows();
	fitContentToFrame();
	setPageStatus("Showing page " + pageNumber + ".");
	document.body.classList.remove("toc-open");
}
function changePublication() {
	if (currentPage >= 0 && currentPage < totalHtmlFiles) {
		var currentPageUrl = document.getElementById("contentIFrame").src;
		currentPageUrl = currentPageUrl.substring(0, currentPageUrl.lastIndexOf("/") + 1);
		var nextPageUrl = currentPageUrl;
		if (currentPage !== 0)
			currentPageUrl = currentPageUrl + "publication-" + currentPage + ".html";
		else
			currentPageUrl = currentPageUrl + "publication" + ".html";
		document.getElementById("contentIFrame").src = currentPageUrl;
		storePageNumber(currentPage * 2);
		updateCoverState();
		if ((currentPage + 1) < totalHtmlFiles) {
			nextPageUrl = nextPageUrl + "publication-" + (currentPage + 1) + ".html";
		}
	}
}
function showNextPage() {
	if (currentPage >= totalHtmlFiles - 1) {
		return;
	}
	++currentPage;
	changePublication();
	showHideArrows();
}
function showPreviousPage() {
	if (currentPage <= 0) {
		return;
	}
	--currentPage;
	changePublication();
	showHideArrows();
}
function showHideArrows() {
	var prev = document.getElementsByClassName("prev")[0];
	var next = document.getElementsByClassName("next")[0];
	if (!prev || !next) {
		return;
	}
	if (currentPage === 0) {
		prev.style.visibility = "hidden";
	} else {
		prev.style.visibility = "visible";
	}
	if (currentPage === (totalHtmlFiles -1)) {
		next.style.visibility = "hidden";
	} else {
		next.style.visibility = "visible";
	}
}
