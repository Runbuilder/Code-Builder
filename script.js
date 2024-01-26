// 데이터 배열과 시트 이름을 저장하는 변수들을 초기화합니다.
let dataArray = [];
let sheetNames = [];
let aData = '';
let bData = '';
let sheetId = '';
let language = 'ko';
// 데이터를 가져오는 함수를 정의합니다.
async function getData(sheetIndex) {
  // 화면을 초기화하고 로딩 표시를 표시합니다.
  document.getElementById('cardContainer').innerHTML = "";
  document.getElementById('loading').style.display = 'block';

  // Google Sheets의 시트 ID와 Google Apps Script의 스크립트 URL을 설정합니다.
  sheetId = '1dCPa8dvEZIoOCyZ2pAhgs4axVbZqmL1eEuk8F5XlsqQ';
  const scriptURL = 'AKfycbxMsLh_CsKktXRwz_VL6JYJtF7NeqI6YnYq_td3ucUhujSS0f61N9EzrvVvPboDLx45tw';
  const URL = sheetIndex ? `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)}&param=${encodeURIComponent(sheetIndex)} ` : `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)} `;

  // 주소로 접속하여 데이터를 가져오는 비동기 작업을 시도합니다.
  try {
    const response = await fetch(URL, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('Google Apps Script 호출 실패1, HTTP 상태 코드: ' + response.status);
    }

    // 에러가 없다면 시트 이름과 데이터를 가져옵니다.
    const data = await response.json();
    sheetNames = data.sheetNames;
    dataArray = data.data;

    // 화면 로딩 표시를 숨기고 데이터를 표시합니다.
    document.getElementById('loading').style.display = 'none';

    if (!sheetIndex) {
      document.querySelector('.title').innerHTML = sheetNames[1];
    }

    if (dataArray.length < 2) {
      console.log(dataArray, '자료없음');
      document.querySelector('.data').innerHTML =
        '<h3 style="text-align:center">자료가 없습니다. 시트정보를 확인해주세요.</h3>';
      return;
    } else {
      document.querySelector('.data').innerHTML = "";
    }

    // 시트 이름과 데이터를 화면에 표시하는 함수를 호출합니다.
    sheetShow(sheetNames)
    dataShow(dataArray, scriptURL, sheetIndex);

  } catch (error) {
    console.error('Google Apps Script 호출 실패2:', error);
    document.getElementById('loading').style.display = 'none';
  }
}

// 웹 페이지 로드 시 데이터를 가져오는 함수를 호출합니다.
getData();
// 시트 이름 데이터를 메뉴 버튼으로 표시하는 함수를 정의합니다.
function sheetShow(sheetNames) {
  var data = sheetNames.slice(1);
  data.forEach((name, index) => {
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('btn');
    button.classList.add('btn-info');
    button.classList.add('sheetBtn');
    button.addEventListener('click', () => {
      console.log('hi', index);
      document.querySelector('.title').innerHTML = name;
      // 선택한 시트의 데이터를 가져오는 함수를 호출합니다.
      getData(index + 1);
    });
    const btnContainer = document.querySelector('.data');
    btnContainer.appendChild(button);
  })
}

// 데이터 배열을 카드 버튼으로 표시하는 함수를 정의합니다.
function dataShow(dataArray, scriptURL, sheetIndex) {
  console.log(dataArray);
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';

  dataArray.forEach((item) => {
    const button = document.createElement('button');
    // button.style.backgroundImage = `url('${item[2]}')`;
    button.style.width = '160px';
    button.style.height = '60px';

    const span = document.createElement('span');
    span.innerHTML = `${item[1].toString()}`;
    span.style.position = 'relative';
    span.style.zIndex = 2;
    button.appendChild(span);
    button.classList.add('btn2');
    button.classList.add('btn');

    // 버튼에 부트스트랩 툴팁 속성 추가
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', `${item[2].toString()}`); // 툴팁 내용 설정

    // 버튼 클릭 시 데이터를 팝업 창으로 표시하는 이벤트 리스너를 추가합니다.
    button.addEventListener('click', function() {
      const textarea = document.querySelector('textarea');
      if (language == 'ko' && item[2]) { // item[0] 존재 여부 확인
        textarea.value += " " + item[2].toString();
      } else if (language == 'en' && item[0]) { // item[3] 존재 여부 확인
        textarea.value += " " + item[0].toString();
      }
    });
    cardContainer.appendChild(button);
  });
}

// 기타 함수들 (goDraw, boom, meta)은 웹 페이지의 다른 기능을 수행하는 함수들입니다.

function goDraw() {
  const textarea = document.querySelector('textarea');
  navigator.clipboard.writeText(textarea.value)
    .then(() => {
      const url = 'https://www.bing.com/images/create'
      window.open(url, '_blank');
    })
}
function boom() {
  const textarea = document.querySelector('textarea');
  textarea.value = " ";
}

function runCode(code) {
  if (code.length === 0) {
    return;
  }
  var newWindow = window.open("", "_blank");
  newWindow.document.open();
  newWindow.document.write(code);
  newWindow.document.close();
}

let editor = '';
let editorContainer = null; // 전역 변수로 선언
async function getCode() {
  let questCode = document.getElementById('request').value;
  const imageInput = document.getElementById('imageInput');

  if (questCode.length <= 1) {
    Swal.fire({
      title: '경고',
      text: '내용을 입력해주세요',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }

  const Url = `https://port-0-totalserver-9zxht12blq81t0ot.sel4.cloudtype.app/generate/html`;

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('userInput', questCode);

  // 기존의 editorContainer 삭제 (중복 방지)
  if (editorContainer) {
    editorContainer.remove();
  }

  // 팝업 창 표시
  Swal.fire({
    title: "코드 작성중..",
    html: "잠시 기다려 주세요...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const response = await fetch(Url, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    let code = data.text;
    let responseElement = code.replace(/```html/g, '').replace(/```/g, '');

    // 팝업 창 닫기
    Swal.close();


    // textarea 아래에 편집기 테두리 표시
    editorContainer = document.createElement('div');
    editorContainer.id = 'editorContainer';
    editorContainer.style.textAlign = 'center';
    editorContainer.style.marginTop = '10px';
    editorContainer.style.padding = '0 15px';

    //버튼표시
    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    const pwa = document.createElement('button');
    pwa.textContent = '📱Make PWA';
    pwa.classList.add('btn-primary');
    pwa.classList.add('btnBuild');

    const button = document.createElement('button');
    button.textContent = '🚀Run Build';
    button.classList.add('btn-primary');
    button.classList.add('btnBuild');
    //아래버튼표시
    const btnDiv2 = document.createElement('div');
    btnDiv2.style.display = 'flex';
    const htmlCode = document.createElement('button');
    htmlCode.textContent = 'index.html';
    htmlCode.classList.add('btn-primary');
    htmlCode.classList.add('btnBuild');
    const manifest = document.createElement('button');
    manifest.textContent = 'Manifest';
    manifest.classList.add('btn-primary');
    manifest.classList.add('btnBuild');
    const serviceWorkers = document.createElement('button');
    serviceWorkers.textContent = 'Service';
    serviceWorkers.classList.add('btn-primary');
    serviceWorkers.classList.add('btnBuild');
    const save = document.createElement('button');
    save.textContent = 'SAVE';
    save.classList.add('btn-primary');
    save.classList.add('btnBuild');

    //편집기 
    const editorElement = document.createElement('div');
    editorElement.id = 'editor';
    editorElement.style.height = '400px';

    //컨테이너에 편집기와 버튼 추가
    btnDiv.appendChild(pwa);
    btnDiv.appendChild(button);
    btnDiv2.appendChild(htmlCode);
    btnDiv2.appendChild(manifest);
    btnDiv2.appendChild(serviceWorkers);
    btnDiv2.appendChild(save);

    editorContainer.appendChild(btnDiv);
    editorContainer.appendChild(editorElement);
    editorContainer.appendChild(btnDiv2);


    //헤더에 컨테이너 추가
    const main = document.querySelector('header');
    main.appendChild(editorContainer);

    // Ace 편집기 초기화
    editor = ace.edit('editor');
    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/monokai");
    editor.setValue(responseElement);
    htmlCode.addEventListener('click', () => { editor.setValue(responseElement); });
    manifest.addEventListener('click', () => {
      const file = 'manifest.js'; // 가져올 파일의 이름
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const fileContent = xhr.responseText;
          // Ace 에디터에 파일 내용을 설정
          editor.setValue(fileContent);
        }
      };
      xhr.open('GET', file, true);
      xhr.send();
    });
    serviceWorkers.addEventListener('click', () => { 
      const file = 'serviceWorker.js'; // 가져올 파일의 이름
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const fileContent = xhr.responseText;
          // Ace 에디터에 파일 내용을 설정
          editor.setValue(fileContent);
        }
      };
      xhr.open('GET', file, true);
      xhr.send();
    });
    save.addEventListener('click', () => { downloadFile(editor.getValue()) });

    pwa.addEventListener('click', () => {
      const code1 = editor.getValue()

      const parser = new DOMParser();
      const doc = parser.parseFromString(code1, "text/html");

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
      // 수정된 HTML 내용을 Ace 편집기에 설정
      editor.setValue(doc.documentElement.outerHTML);
    });

    button.addEventListener('click', () => {
      const code = editor.getValue()
      runCode(code)
    });

  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: '에러',
      text: '분석 중 에러가 발생했습니다!',
      icon: 'error',
      confirmButtonText: '닫기'
    });
  }
}


function downloadFile(value) {
  if (value.length < 10) { return; }
  let extension, fileName, fileType;
  if (value.startsWith('{')) {
    extension = 'json';
    fileName = 'manifest.json';
    fileType = 'application/json';
    // } else if (value.startsWith('<!DOCTYPE html>') || value.startsWith('<html>')) {
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


// async function getCode() {
//   let questCode = document.getElementById('request').value;
//   const imageInput = document.getElementById('imageInput');
//   console.log(questCode);

//   if (questCode.length <= 1) {
//     Swal.fire({
//       title: '경고',
//       text: '내용을 입력해주세요',
//       icon: 'warning',
//       confirmButtonText: '확인'
//     });
//     return;
//   }
//   const Url = `https://port-0-totalserver-9zxht12blq81t0ot.sel4.cloudtype.app/generate/html`;
//   const formData = new FormData();
//   formData.append('image', imageInput.files[0]);
//   formData.append('userInput', questCode);
//   try {
//     const response = await fetch(Url, {
//       method: 'POST',
//       body: formData
//     });
//     const data = await response.json();
//     let code = data.text;
//     let responseElement = code.replace(/```html/g, '').replace(/```/g, '');

//     Swal.fire({
//       title: 'CODE',
//       html: '<div id="editor" style="height: 400px;"></div>', // 편집기를 위한 컨테이너
//       focusConfirm: false,
//       didOpen: () => {
//         editor = ace.edit('editor');
//         editor.session.setMode("ace/mode/javascript");
//         editor.setTheme("ace/theme/monokai");
//         editor.setValue(responseElement);
//       },
//       preConfirm: () => {
//         return editor.getValue(); // Ace 편집기의 값을 반환
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         runCode(result.value); 
//       }
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     Swal.fire({
//       title: '에러',
//       text: '분석 중 에러가 발생했습니다!',
//       icon: 'error',
//       confirmButtonText: '닫기'
//     });
//   }
// }
