(function(){
  const form=document.getElementById('hotel-form');
  const status=document.getElementById('hotel-status');
  const success=document.getElementById('hotel-success');
  const submitFrame=document.createElement('iframe');
  submitFrame.name='hotel-request-submit';
  submitFrame.hidden=true;
  submitFrame.setAttribute('aria-hidden','true');
  document.body.appendChild(submitFrame);
  form.target=submitFrame.name;
  document.getElementById('hotel-page').value=location.href;
  form.addEventListener('submit',event=>{
    event.preventDefault();status.textContent='';status.className='form-status';
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('website'))return;
    document.getElementById('hotel-submitted').value=new Date().toISOString();
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';
    form.submit();
    document.getElementById('hotel-form-state').hidden=true;
    success.classList.add('is-visible');
    success.focus();
  });
})();
