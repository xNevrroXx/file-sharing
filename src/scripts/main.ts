import customFileInputForm from "./modules/custom-file-input-form";
import {v4 as uuidv4} from "uuid";
import conversionSizeUnits from "./modules/conversion-size-units";

window.addEventListener("DOMContentLoaded", () => {
  const sharingStagesSelectors = {
    choosingFiles: ".modal-choosing-files",
    transferringFiles: ".modal-transferring",
    filesTransferred: ".modal-transferred"
  }

  const choosingModalElem = document.querySelector(sharingStagesSelectors.choosingFiles);
  const transferringModalElem = document.querySelector(sharingStagesSelectors.transferringFiles);
  const transferredModalElem = document.querySelector(sharingStagesSelectors.filesTransferred);

  // functional of the file input
  customFileInputForm({
      containerSelector: sharingStagesSelectors.choosingFiles,
      inputSelector: ".modal-choosing-files__share-form > input",
      customInputSelector: ".modal-choosing-files__share-form > div",
      fileListSelector: ".modal-choosing-files__file-list",
      plugSelector: ".modal-choosing-files__plug",
      totalDescriptionSelectors: {
        count: ".modal-choosing-files__add-files-count span",
        size: ".modal-choosing-files__add-files-size span"
      },
      uploadBtnSelector: ".modal-choosing-files__get-link-btn"
    }
  );

  // upload to the server
  const sharingFormElem: HTMLFormElement = choosingModalElem.querySelector("form");
  sharingFormElem.addEventListener("submit", function (event) {
    event.preventDefault();
    choosingModalElem.classList.remove("active");
    transferringModalElem.classList.add("active");
    this.querySelector("input").setAttribute("name", uuidv4());

    const formdata = new FormData(this);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    transferringModalElem.querySelector(".modal-transferring__cancel-btn").addEventListener("click", (event) => {
      xhr.abort();
      alert("transferring has been cancelled");
      choosingModalElem.classList.add("active");
      transferringModalElem.classList.remove("active");
    })
    xhr.upload.addEventListener("progress", (event) => {
      const loadedSize = event.loaded;
      const totalSize = event.total;

      redrawPercentage(loadedSize, totalSize);
    })
    xhr.addEventListener("readystatechange", (event) => {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        onTransferred(xhr.response);
      }
    })

    xhr.upload.addEventListener("error", () => alert("upload unexpected error"));

    xhr.send(formdata);
  })
  // redraw transferred percentages
  function redrawPercentage(loadedSize: number, totalSize: number) {
    const fullInfoSelectors = {
      loaded: ".modal-transferring__uploaded-size",
      total: ".modal-transferring__total-size"
    }
    const circleIndicatorSelectors = {
      numberPercentages: ".circle-indicator__number",
      svgIndicator: ".modal-transferring__upload-indicator .circle-indicator__indicator"
    }

    const loadedConversionedSize = conversionSizeUnits(loadedSize);
    const totalConversionedSize = conversionSizeUnits(totalSize);
    transferringModalElem.querySelector(fullInfoSelectors.loaded).textContent = loadedConversionedSize.size + " " + loadedConversionedSize.units;
    transferringModalElem.querySelector(fullInfoSelectors.total).textContent = totalConversionedSize.size + " " + totalConversionedSize.units;

    const amountPercentage = loadedSize / (totalSize / 100);
    transferringModalElem.querySelector(circleIndicatorSelectors.numberPercentages).textContent = amountPercentage.toFixed(0);

    const circleIndicator: SVGCircleElement = transferringModalElem.querySelector(circleIndicatorSelectors.svgIndicator);
    const radius = circleIndicator.getAttribute("r");
    const circumferenceLength = 2 * Math.PI * 50;
    const onePercentOnCircumference = circumferenceLength / 100;
    circleIndicator.style.strokeDashoffset = (circumferenceLength - onePercentOnCircumference * amountPercentage) + "px";
  }

  // download from the server
  function onTransferred(serverResponse: any) {
    transferringModalElem.classList.remove("active");
    transferredModalElem.classList.add("active");

    const jsonServerResponse = JSON.parse(serverResponse);
    const copyLinkElem = transferredModalElem.querySelector(".modal-transferred__copy-link");
    copyLinkElem.addEventListener("click", function (event) {
      console.log(window.location);
      this.textContent = window.location + jsonServerResponse.path;
      this.classList.add("link");
      navigator.clipboard.writeText(this.textContent)
        .then(() => alert("Link has been copied"))
    })

    console.log("serverResponse: ", serverResponse);

  }
})