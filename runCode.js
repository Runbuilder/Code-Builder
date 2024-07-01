function runCode(code) {
  if (code.length === 0) {
    return;
  }
  var newWindow = window.open("", "_blank");
  newWindow.document.open();
  newWindow.document.write(code);
  newWindow.document.close();
}
