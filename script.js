function getCode() {
  let questCode = document.getElementById('request').value;
  let responseElement = document.getElementById('response');

  const imageInput = document.getElementById('imageInput');
  if (imageInput.files.length === 0) {
    Swal.fire({
      title: '경고',
      text: '디자인 이미지를 업로드 해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }

  if (questCode.length <= 10) {
    Swal.fire({
      title: '경고',
      text: ' 내용을 입력해주세요',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }

  responseElement.value = "";
  document.getElementById('loading').classList.remove('hidden');
  document.querySelector('.btn1').classList.add('hidden');

  const Url = `https://port-0-totalserver-9zxht12blq81t0ot.sel4.cloudtype.app/generate/html`;

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('userInput', questCode);

  fetch(Url, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      responseElement.value = data.text;
      document.getElementById('loading').classList.add('hidden');
      document.querySelector('.btn1').classList.remove('hidden');
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: '에러',
        text: '분석 중 에러가 발생했습니다!',
        icon: 'error',
        confirmButtonText: '닫기'
      });
      document.getElementById('loading').classList.add('hidden');
      document.querySelector('.btn1').classList.remove('hidden');
    });
}


function runCode() {

  var code = document.getElementById("response").value;
  if (code.length === 0) {
    Swal.fire({
      title: '경고',
      text: '내용을 입력해주세요',
      icon: 'warning',
      confirmButtonText: '확인'
    });
    return;
  }
  var newWindow = window.open("", "_blank");
  newWindow.document.open();
  newWindow.document.write(code);
  newWindow.document.close();
}

function handleFileSelect(event) {
  //previewImage(event);
  // 파일이 선택되면 버튼 활성화
  const hasFile = event.target.files.length > 0;
  document.getElementById('btn1').disabled = !hasFile;
}