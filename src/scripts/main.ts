import customFileInputForm from "./modules/custom-file-input-form";

window.addEventListener("DOMContentLoaded", () => {
  const sharingStagesSelectors = {
    choosingFiles: ".modal-choosing-files",
    transferringFiles: ".modal-transferring",
    filesTransferred: ".modal-transferred"
  }

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
})