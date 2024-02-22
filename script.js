// 데이터 배열과 시트 이름을 저장하는 변수들을 초기화합니다.
let dataArray = [];
let sheetNames = [];
let aData = '';
let bData = '';
const sheetId = '1dCPa8dvEZIoOCyZ2pAhgs4axVbZqmL1eEuk8F5XlsqQ';
const scriptURL = 'AKfycbzNIBs_4ZjRDL3ku6tvFhoSKRynZD3YPfcAIeUxQzZ1eu2dZWt55TwVzqf9yNM-7L-eQw';
let language = 'ko';
let password = '';
let editor = '';
let editorContainer = null; // 전역 변수로 선언
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
let examTF = true;

//문서 로드되면 편집기 초기화
document.addEventListener('DOMContentLoaded', function() {
  // Ace Editor 컨테이너를 선택
  editor = ace.edit('editor');
  // 사용할 프로그래밍 언어 모드를 설정 (여기서는 JavaScript)
  editor.session.setMode("ace/mode/javascript");
  // 에디터의 테마 설정 (여기서는 Monokai)
  editor.setTheme("ace/theme/monokai");
  // 필요한 경우, 에디터의 기본 설정을 변경
  editor.session.setOptions({
    tabSize: 4,
    useSoftTabs: true
  });
  //처음 편집기에 들어갈 문장 코드
  editor.setValue(responseElement, -1);
  // -1은 커서 위치를 문서의 시작으로 설정
});

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

      const textarea = document.querySelector('textarea');
      let value = editor.getValue()
      console.log(exam,value)
      if (exam) { textarea.value = "" }
      if (exam) {  editor.setValue(item[3].toString());  }


     
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
  if(exam){return;}
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

async function getCode() {
  const imageInput = document.getElementById('imageInput');
  let questCode = document.getElementById('request').value;
  const Url = `https://port-0-totalserver-9zxht12blq81t0ot.sel4.cloudtype.app/generate/html`;
  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('userInput', questCode);
  // 기존의 editorContainer 삭제 (중복 방지)
  if (editorContainer) { editorContainer.remove(); } 
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
    responseElement = code.replace(/```html/g, '').replace(/```/g, '');

    // 팝업 창 닫기
    Swal.close();

    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/monokai");
    editor.setValue(responseElement);
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

const htmlCode = document.querySelector('#htmlCode');
htmlCode.addEventListener('click', () => {
  runTF = true;

  editor.setValue(responseElement);
  pwaTF = false;
});

const manifest = document.querySelector('#manifest');
manifest.addEventListener('click', () => {
  runTF = false;
  // runBuild.classList.add('disabled')

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

const serviceWorkers = document.querySelector('#serviceWorkers');
serviceWorkers.addEventListener('click', () => {
  runTF = false;

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

const save = document.querySelector('#save');
save.addEventListener('click', () => { downloadFile(editor.getValue()) });

const pwa = document.querySelector('#pwa');
pwa.addEventListener('click', () => {
  runTF = true;
  const code1 = editor.getValue()
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
  // 수정된 HTML 내용을 Ace 편집기에 설정
  editor.setValue(doc.documentElement.outerHTML);
  pwaVal = doc.documentElement.outerHTML;
  pwaTF = true;

});

const runBuild = document.querySelector('#runBuild');
runBuild.addEventListener('click', () => {
  const code = editor.getValue()
  if (code.length === 0 || !runTF) {
    return;
  }

  runCode(code)
});


function runCode(code) {
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

// document.getElementById('deployBtn').addEventListener('click', function() {
//   const zip = new JSZip();
//   // index.html 파일을 포함하는 폴더를 생성합니다.
//   // 예시로 'website'라는 폴더를 생성하여 파일을 추가합니다.
//   zip.folder("website").file("index.html", editor.getValue());

//   var netlifyToken = 'nfp_wYwpHMXDZrzE5WRVQHFyvmqAsSjMPEsq2655'; // 주의: 실제 사용시 보안 관련 대책 필요
//   var apiURL = `https://api.netlify.com/api/v1/sites`;

//   // JSZip의 generateAsync 메서드를 사용하여 비동기적으로 ZIP 파일 생성
//   zip.generateAsync({type: 'blob'})
//     .then(function(content) {
//       const formData = new FormData();
//       formData.append('zip', content);

//       // Fetch API를 사용하여 넷틀리파이에 배포 요청
//       // Content-Type을 'application/zip'으로 설정하는 부분은 제거합니다.
//       // 이는 Fetch API가 FormData 객체를 사용할 때 자동으로 적절한 Content-Type을 설정하기 때문입니다.
//       return fetch(apiURL, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${netlifyToken}`
//         },
//         body: formData
//       });
//     })
//     .then(response => response.json())
//     .then(data => {
//       const tempURL = data.deploy_url;
//       document.getElementById('tempURL').textContent = tempURL;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       document.getElementById('tempURL').textContent = '배포 중 오류가 발생했습니다.';
//     });
// });
