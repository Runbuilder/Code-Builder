// 데이터 배열과 시트 이름을 저장하는 변수들을 초기화합니다.
let dataArray = [];
let sheetNames = [];
let aData = '';
let bData = '';
const sheetId = '1dCPa8dvEZIoOCyZ2pAhgs4axVbZqmL1eEuk8F5XlsqQ';
const scriptURL = 'AKfycbzNIBs_4ZjRDL3ku6tvFhoSKRynZD3YPfcAIeUxQzZ1eu2dZWt55TwVzqf9yNM-7L-eQw';

let language = 'ko';
let password = ''
// 데이터를 가져오는 함수를 정의합니다.
async function getData(sheetIndex) {
  // 화면을 초기화하고 로딩 표시를 표시합니다.
  // document.getElementById('request').value = "";
  document.getElementById('comment').value = "";

  document.getElementById('cardContainer').innerHTML = "";
  document.getElementById('loading').style.display = 'block';

  // Google Sheets의 시트 ID와 Google Apps Script의 스크립트 URL을 설정합니다.
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
    dataShow(dataArray);
    password = dataArray[0][1]; // B2 셀 데이터
    // console.log(dataArray, password);

  } catch (error) {
    console.error('Google Apps Script 호출 실패2:', error);
    document.getElementById('loading').style.display = 'none';
  }
}

// 웹 페이지 로드 시 데이터를 가져오는 함수를 호출합니다.
getData();
// 시트 이름 데이터를 메뉴 버튼으로 표시하는 함수를 정의합니다.
let exam = true;
function sheetShow(sheetNames) {
  var data = sheetNames.slice(1);
  data.forEach((name, index) => {
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('btn');
    button.classList.add('btn-info');
    button.classList.add('sheetBtn');
    button.addEventListener('click', () => {
      if (index === 0) {
        exam = true;
      } else {
        exam = false;
      }
      console.log('hi', index, exam);

      document.querySelector('.title').innerHTML = name;
      // 선택한 시트의 데이터를 가져오는 함수를 호출합니다.
      getData(index + 1);
    });
    const btnContainer = document.querySelector('.data');
    btnContainer.appendChild(button);
  })
}

// 데이터 배열을 카드 버튼으로 표시하는 함수를 정의합니다.
function dataShow(dataArray) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';

  dataArray.forEach((item) => {
    const button = document.createElement('button');

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
      let textarea = document.querySelector('textarea');
      
      if (exam) { textarea.value = "" }

      if (language == 'ko' && item[2]) { // item[0] 존재 여부 확인
        textarea.value += " " + item[2].toString();
      } else if (language == 'en' && item[0]) { // item[3] 존재 여부 확인
        textarea.value += " " + item[0].toString();
      }
    });
    cardContainer.appendChild(button);
  });
}


// 비밀번호 확인 함수
async function checkPassword() {

  let questCode = document.getElementById('request').value;
  const passwordInput = document.getElementById('password').value;

  if (passwordInput.length <= 1) {
    Swal.fire({
      title: '경고',
      text: '비밀번호를 입력해주세요',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }

  if (questCode.length <= 1) {
    Swal.fire({
      title: '경고',
      text: '프롬프트 내용을 입력해주세요',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }

  // 팝업 창 표시
  Swal.fire({
    title: "코드 분석중..",
    html: "잠시 기다려 주세요...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });


  // Google Apps Script 호출 URL 구성
  const URL = `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?sn=${encodeURIComponent(sheetId)}&pw=${encodeURIComponent(passwordInput)}`;

  try {
    const response = await fetch(URL, { mode: 'cors' });
    const data = await response.json();

    // 인증 성공 여부 확인
    if (data.authSuccess) {
      // 코드 가져오기 함수 호출 또는 인증 성공 시의 로직
      console.log('인증 성공');
      getCode(); // 필요한 경우 주석 해제
      saveData();//프롬프트내용저장
    } else {
      // 인증 실패 알림
      Swal.fire({
        title: '경고',
        text: '올바른 비밀번호를 입력해주세요',
        icon: 'warning',
        confirmButtonText: '확인'
      });
    }
  } catch (error) {
    console.error('인증 과정에서 오류가 발생했습니다:', error);
  }
}

async function saveData(coments) {
  let coment = `댓글 : ${document.getElementById('comment').value}`
  let questCode = coments ? coment : document.getElementById('request').value;
  const data = {
    prompt: questCode,
    sheetId: sheetId
  };
  const URL = `https://script.google.com/macros/s/${encodeURIComponent(scriptURL)}/exec?order=saveData`;
  try {
    const response = await fetch(URL, { method: 'POST', body: JSON.stringify(data), mode: 'no-cors' });
    document.getElementById('comment').value = "";
  } catch (error) {
    console.error(error);
  }
}

let editor = '';
let editorContainer = null; // 전역 변수로 선언

async function getCode() {
  const imageInput = document.getElementById('imageInput');
  let questCode = document.getElementById('request').value;

  const Url = `https://port-0-totalserver-9zxht12blq81t0ot.sel4.cloudtype.app/generate/html`;

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('userInput', questCode);

  // 기존의 editorContainer 삭제 (중복 방지)
  if (editorContainer) {
    editorContainer.remove();
  }

  // fetch를 위한 재시도 횟수 설정
  const maxAttempts = 3;
  let attempt = 0;
  let response;
  while (attempt < maxAttempts) {
    try {
      response = await fetch(Url, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      // 성공한 경우, 반복문 탈출
      console.log(`Attempt ${attempt + 1}: Success`);
      break;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt < maxAttempts) {
        console.log(`Retrying... Attempt ${attempt + 1}`);
      } else {
        console.log('Max retry attempts reached. Failing...');
        Swal.fire({
          title: '에러',
          text: '분석 중 에러가 발생했습니다!',
          icon: 'error',
          confirmButtonText: '닫기'
        });
        return; // 최대 시도 횟수에 도달하면 함수 종료
      }
    }
  }

  try {
    // fetch 성공 후의 로직
    const data = await response.json();
    let code = data.text;
    let responseElement = code.replace(/```html/g, '').replace(/```/g, '');

    // 팝업 창 닫기
    Swal.close();




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
    // 이 catch 블록은 JSON 파싱 또는 그 이후의 로직에서 오류가 발생했을 때 실행됩니다.
    Swal.fire({
      title: '에러',
      text: '분석 중 에러가 발생했습니다!',
      icon: 'error',
      confirmButtonText: '닫기'
    });
  }
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
