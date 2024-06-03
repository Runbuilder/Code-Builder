// 데이터 배열과 시트 이름을 저장하는 변수들을 초기화합니다.
const allData = {}; // 모든 시트의 데이터를 저장할 객체
const sheetNames = [];
let password = '';
let editor = '';
let selectedButton = null; // 선택된 버튼을 저장하는 변수
const sheetId = '1dCPa8dvEZIoOCyZ2pAhgs4axVbZqmL1eEuk8F5XlsqQ';
const scriptURL = 'AKfycbzNIBs_4ZjRDL3ku6tvFhoSKRynZD3YPfcAIeUxQzZ1eu2dZWt55TwVzqf9yNM-7L-eQw';
let language = 'ko';
let responseElement = `
  <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>제목</title>
      </head>
      <body>
        <h1>너는 무엇을 만들고 싶니?</h1>
      </body>
  </html>`;
let runTF = true;
let pwaTF = false;
let pwaVal = "";
let exam = true;
let buttonsCreated = false; // 버튼 생성 여부를 저장하는 변수

//문서 로드되면 편집기 초기화
document.addEventListener('DOMContentLoaded', function() {
  editor = ace.edit('editor');
  editor.session.setMode("ace/mode/javascript");
  editor.setTheme("ace/theme/monokai");
  editor.session.setOptions({
    tabSize: 4,
    useSoftTabs: true
  });
  editor.setValue(responseElement, -1);
});

// 초기 데이터를 가져오는 함수를 정의합니다.
async function getInitialData() {
  document.getElementById('cardContainer').innerHTML = "";
  document.getElementById('loading').style.display = 'block';

  const URL = `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)}`;

  try {
    const response = await fetch(URL, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('Google Apps Script 호출 실패1, HTTP 상태 코드: ' + response.status);
    }

    const data = await response.json();
    sheetNames.push(...data.sheetNames);

    const initialSheetURL = `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)}&param=${encodeURIComponent(1)}`;
    const initialSheetResponse = await fetch(initialSheetURL, { mode: 'cors' });
    const initialSheetData = await initialSheetResponse.json();
    allData[sheetNames[1]] = initialSheetData.data;

    sheetShow(sheetNames);
    dataShow(allData[sheetNames[1]]);
    password = allData[sheetNames[1]][0][1]; // B2 셀 데이터

    getRemainingData();
  } catch (error) {
    console.error('Google Apps Script 호출 실패2:', error);
    document.getElementById('loading').style.display = 'none';
  }
}

// 나머지 시트의 데이터를 가져오는 함수를 정의합니다.
async function getRemainingData() {
  for (let i = 2; i < sheetNames.length; i++) {
    const sheetURL = `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)}&param=${encodeURIComponent(i)}`;
    const sheetResponse = await fetch(sheetURL, { mode: 'cors' });
    const sheetData = await sheetResponse.json();
    allData[sheetNames[i]] = sheetData.data;
  }
}

getInitialData();

// 시트 이름 데이터를 메뉴 버튼으로 표시하는 함수를 정의합니다.
function sheetShow(sheetNames) {
  if (buttonsCreated) return; // 이미 버튼이 생성되었으면 함수를 종료합니다.

  const data = sheetNames.slice(1);

  data.forEach((name, index) => {
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('btn', 'btn-info', 'sheetBtn');
    button.addEventListener('click', () => {
      if (selectedButton) {
        selectedButton.classList.remove('btn-primary');
        selectedButton.classList.add('btn-info');
      }

      button.classList.remove('btn-info');
      button.classList.add('btn-primary');
      selectedButton = button;

      exam = index === 0;

      if (!allData[name]) {
        document.getElementById('cardContainer').innerHTML = "";
        document.getElementById('loading').style.display = 'block';
      } else {
        dataShow(allData[name]);
      }
    });

    const btnContainer = document.querySelector('.data2');
    btnContainer.appendChild(button);

    if (index === 0) {
      button.classList.remove('btn-info');
      button.classList.add('btn-primary');
      selectedButton = button;
    }
  });

  buttonsCreated = true; // 버튼 생성 완료를 표시합니다.
}

// 데이터 배열을 카드 버튼으로 표시하는 함수를 정의합니다.
function dataShow(dataArray) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';
  document.getElementById('loading').style.display = 'none';

  let selectedButton = null;

  dataArray.forEach((item) => {
    const button = document.createElement('button');
    const span = document.createElement('span');
    span.innerHTML = `${item[1].toString()}`;
    span.style.position = 'relative';
    span.style.zIndex = 2;
    button.appendChild(span);
    button.style.backgroundImage = `url('${item[4]}')`;
    button.style.width = '160px';
    button.style.height = '160px';
    button.classList.add('btn2', 'btn');

    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', `${item[2].toString()}`);

    button.addEventListener('click', function() {
      const textarea = document.getElementById('request');
      editor.setValue(item[3].toString());

      if (language == 'ko' && item[2]) {
        textarea.value += " " + item[2].toString();
      } else if (language == 'en' && item[0]) {
        textarea.value += " " + item[0].toString();
      }

      if (selectedButton) {
        selectedButton.classList.remove('btn-primary');
      }

      button.classList.add('btn-primary');
      selectedButton = button;

      if (item[4] && item[4].toString().trim() !== '') {
        const converter = new showdown.Converter();
        const html = converter.makeHtml(item[2].toString());
        Swal.fire({
          html: html,
          showDenyButton: true,
          denyButtonText: 'Close',
          confirmButtonText: 'Copy',
          customClass: {
            content: 'custom-content-class'
          },
          preConfirm: () => {
            navigator.clipboard.writeText(item[3].toString())
              .then(() => {
                Swal.fire('Copied!', 'App Script 코드가 클립보드에 복사되었습니다.', 'success');
              })
              .catch((error) => {
                console.error('Failed to copy item[3] to clipboard:', error);
                Swal.fire('Oops!', 'Failed to copy item[3] to clipboard.', 'error');
              });
          }
        });
      }
    });

    cardContainer.appendChild(button);
  });
}

const htmlCode = document.querySelector('#htmlCode');
htmlCode.addEventListener('click', () => {
  runTF = true;
  editor.setValue(responseElement);
  pwaTF = false;
});

const manifest = document.querySelector('#manifest');
manifest.addEventListener('click', () => {
  runTF = false;
  fetchFileContent('manifest.js');
});

const serviceWorkers = document.querySelector('#serviceWorkers');
serviceWorkers.addEventListener('click', () => {
  runTF = false;
  fetchFileContent('serviceWorker.js');
});

const save = document.querySelector('#save');
save.addEventListener('click', () => { downloadFile(editor.getValue()) });

const pwa = document.querySelector('#pwa');
pwa.addEventListener('click', () => {
  runTF = true;
  const code1 = editor.getValue();
  const parser = new DOMParser();
  const doc = parser.parseFromString(code1, "text/html");
  if (pwaTF) {
    editor.setValue(pwaVal);
    return;
  }
  const head = doc.head;
  const body = doc.body;

  const manifestLink = document.createElement("link");
  manifestLink.setAttribute("rel", "manifest");
  manifestLink.setAttribute("href", "/manifest.json");
  const script = document.createElement("script");
  script.innerHTML = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./serviceWorker.js')
          .then(registration => {
            console.log('Service worker registered:', registration);
          })
          .catch(error => {
            console.log('Service worker registration failed:', error);
          });
      });
    }
  `;

  head.appendChild(manifestLink);
  body.appendChild(script);

  editor.setValue(doc.documentElement.outerHTML);
  pwaVal = doc.documentElement.outerHTML;
  pwaTF = true;
});

const runBuild = document.querySelector('#runBuild');
runBuild.addEventListener('click', () => {
  const code = editor.getValue();
  if (code.length === 0 || !runTF) return;

  runCode(code);
});

function runCode(code) {
  const newWindow = window.open("", "_blank");
  newWindow.document.open();
  newWindow.document.write(code);
  newWindow.document.close();
}

function downloadFile(value) {
  if (value.length < 10) return;
  let extension, fileName, fileType;
  if (value.startsWith('{')) {
    extension = 'json';
    fileName = 'manifest.json';
    fileType = 'application/json';
  } else if (value.startsWith('const')) {
    extension = 'js';
    fileName = 'serviceWorkers.js';
    fileType = 'application/javascript';
  } else {
    extension = 'html';
    fileName = 'index.html';
    fileType = 'text/html';
  }

  const blob = new Blob([value], { type: fileType });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.click();
}

async function fetchFileContent(file) {
  try {
    const response = await fetch(file);
    if (response.ok) {
      const fileContent = await response.text();
      editor.setValue(fileContent);
    } else {
      console.error('Failed to fetch file:', file);
    }
  } catch (error) {
    console.error('Error fetching file:', error);
  }
}

// 댓글 전송
async function saveData(event) {
  event.preventDefault();
  const comment = document.getElementById('comment').value.trim();
  if (!comment) return;

  const data = {
    comment: `IMG : ${comment}`,
    sheetId: sheetId
  };

  try {
    await fetch(`https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?order=saveData`, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'no-cors'
    });
    document.getElementById('comment').value = "";

    Swal.fire({
      icon: 'success',
      title: '메시지 전송 완료',
      text: '메시지가 성공적으로 전송되었습니다.',
      confirmButtonText: '확인'
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: '메시지 전송 실패',
      text: '메시지 전송 중 오류가 발생했습니다.',
      confirmButtonText: '확인'
    });
  }
}
