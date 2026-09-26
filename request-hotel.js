(function(){
  const form=document.getElementById('hotel-form');
  const status=document.getElementById('hotel-status');
  const success=document.getElementById('hotel-success');
  document.getElementById('hotel-page').value=location.href;
  form.addEventListener('submit',async event=>{
    event.preventDefault();status.textContent='';status.className='form-status';
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('website'))return;
    document.getElementById('hotel-submitted').value=new Date().toISOString();
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';
    try{
      const query=new URLSearchParams(new FormData(form));
      const response=await fetch(form.action+'?'+query.toString(),{method:'GET'});
      if(!response.ok)throw new Error('The request could not be delivered.');
      const result=await response.json();
      if(!result.ok)throw new Error(result.error||'The request could not be delivered.');
      document.getElementById('hotel-form-state').hidden=true;success.classList.add('is-visible');success.focus();
    }catch(error){status.textContent=(error.message||'We could not send your request.')+' Please try again or email sara@latecheckouttravel.com.';status.classList.add('error')}
    finally{button.disabled=false;button.textContent='Send hotel request'}
  });
})();
