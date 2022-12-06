import conversionSizeUnits from "./conversion-size-units";

function customFileInputForm({ containerSelector, inputSelector, customInputSelector, fileListSelector, plugSelector, totalDescriptionSelectors, uploadBtnSelector}
                         : { containerSelector: string, inputSelector: string, customInputSelector: string, fileListSelector: string, plugSelector: string, totalDescriptionSelectors: {count: string, size: string}, uploadBtnSelector: string}) {
  const containerElem = document.querySelector(containerSelector);
  const inputElem: HTMLInputElement = containerElem.querySelector(inputSelector);
  const customInputElem = containerElem.querySelector(customInputSelector);
  const fileListElem = containerElem.querySelector(fileListSelector);
  const plugElem = containerElem.querySelector(plugSelector);
  const totalDescriptionElems = {
    count: containerElem.querySelector(totalDescriptionSelectors.count),
    size: containerElem.querySelector(totalDescriptionSelectors.size),
  }
  const uploadBtnElem: HTMLButtonElement = containerElem.querySelector(uploadBtnSelector);
  const listFileElems: HTMLElement[] = [];
  let fileList: File[] = [];

  customInputElem.addEventListener("click", () => {
    inputElem.click();
  });

  inputElem.addEventListener("change", () => {
    fileList = Array.from(inputElem.files);

    drawFileList();
    drawTotalDescription();
    getReadyStateUploadButton();
  })

  fileListElem.addEventListener("click", (event) => {
    const target = event.target;

    // getting index of the target file
    if (target instanceof HTMLElement && target.tagName === "BUTTON" && target.classList.contains("modal-choosing-files__remove-file")) {
      const dt = new DataTransfer();
      const index = +target.getAttribute("data-index");
      fileList.splice(index, 1);

      inputElem.files = null;

      for (const file of fileList) {
        dt.items.add(file);
      }
      inputElem.files = dt.files;

      drawFileList();
      drawTotalDescription();
      getReadyStateUploadButton();
    }
  })

  function drawFileList() {
    listFileElems.length = 0;
    fileListElem.innerHTML = "";

    if (fileList.length > 0) plugElem.classList.remove("active");
    else plugElem.classList.add("active");

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileType = file.name.slice(file.name.lastIndexOf(".") + 1);
      const fileName = file.name.replace("." + fileType, "");
      const convertedSize = conversionSizeUnits(file.size);

      const fileElem = document.createElement("li");
      fileElem.classList.add("modal-choosing-files__file");
      fileElem.setAttribute("data-index", i.toString());
      fileElem.innerHTML = `
        <div class="modal-choosing-files__file-info file-info">
          <div class="file-info__title">${fileName}</div>
          <div class="file-info__details">
            <span class="file-info__size">${convertedSize.size} ${convertedSize.units}</span>
            <span class="file-info__mime-type">${fileType}</span>
          </div>
          <button data-index="${i}" class="modal-choosing-files__remove-file">
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
              xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:svg="http://www.w3.org/2000/svg">
              <path
                d="m 1.5978827,1.5008904 c 1.3348509,-1.33452052 3.4984303,-1.33452052 4.8332809,0 l 9.6658794,9.6663016 9.665878,-9.6663016 c 1.33451,-1.33452052 3.49843,-1.33452052 4.83294,0 1.334852,1.3348619 1.334852,3.498459 0,4.8329794 l -9.665878,9.6663022 9.665878,9.665956 c 1.334509,1.334523 1.334509,3.49846 0,4.83298 -1.33451,1.334523 -3.49843,1.334523 -4.83294,0 l -9.665878,-9.665956 -9.6658794,9.665956 c -1.3348506,1.334523 -3.49843,1.334523 -4.8332809,0 -1.33451025,-1.33452 -1.33451025,-3.498457 0,-4.83298 L 11.264104,16.000172 1.5978827,6.3338698 c -1.33451025,-1.3345204 -1.33451025,-3.4981175 0,-4.8329794 z"
              />
            </svg>
          </button>
        </div>
      `;

      listFileElems.push(fileElem);
      fileListElem.append(fileElem);
    }
  }
  function drawTotalDescription() {
    totalDescriptionElems.count.textContent = fileList.length.toString();

    let totalSize = 0;
    for (const file of fileList) {
      totalSize += file.size;
    }
    
    const convertedSize = conversionSizeUnits(totalSize);
    totalDescriptionElems.size.textContent = convertedSize.size + " " + convertedSize.units;
  }
  function getReadyStateUploadButton() {
    uploadBtnElem.disabled = inputElem.files.length <= 0;
  }
}

export default customFileInputForm;