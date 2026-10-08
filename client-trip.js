(function(){
  const gate=document.getElementById('password-gate');
  const form=document.getElementById('password-form');
  const input=document.getElementById('trip-password');
  const status=document.getElementById('gate-status');
  const expected='0d1e478de2157d48bafd528a04997337c1dfd15b9a5123130614d8868b32e8bc';

  function unlock(){
    document.body.classList.remove('locked');
    gate.classList.add('is-open');
    gate.setAttribute('aria-hidden','true');
    window.setTimeout(function(){gate.hidden=true;},500);
  }

  async function digest(value){
    const data=new TextEncoder().encode(value.trim().toLowerCase());
    const hash=await crypto.subtle.digest('SHA-256',data);
    return Array.from(new Uint8Array(hash)).map(function(byte){return byte.toString(16).padStart(2,'0');}).join('');
  }

  if(sessionStorage.getItem('lateCheckoutSarahAccess')==='granted') unlock();

  form.addEventListener('submit',async function(event){
    event.preventDefault();
    status.textContent='Checking…';
    try{
      if(await digest(input.value)===expected){
        sessionStorage.setItem('lateCheckoutSarahAccess','granted');
        status.textContent='';
        unlock();
      }else{
        status.textContent='That password doesn’t match. Please try again.';
        input.select();
      }
    }catch(error){
      status.textContent='Please refresh the page and try again.';
    }
  });
})();
