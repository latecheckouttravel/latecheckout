(function(){
  const form=document.getElementById('access-form');
  const status=document.getElementById('access-status');
  const success=document.getElementById('success-state');
  const params=new URLSearchParams(location.search);
  document.getElementById('referral-source').value=params.get('ref')||params.get('utm_source')||'';
  document.getElementById('submission-page').value=location.href;
  form.addEventListener('submit',async event=>{
    event.preventDefault();status.textContent='';status.className='form-status';
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('website'))return;
    document.getElementById('submission-time').value=new Date().toISOString();
    const helpWith=String(data.get('helpWith')||'').trim();
    document.getElementById('legacy-employer').value=helpWith?'[Help requested] '+helpWith:'Not collected';
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';
    try{
      const query=new URLSearchParams(new FormData(form));
      const response=await fetch(form.action+'?'+query.toString(),{method:'GET'});
      if(!response.ok)throw new Error('The request could not be delivered.');
      const result=await response.json();
      if(!result.ok)throw new Error(result.error||'The request could not be delivered.');
      document.getElementById('form-state').hidden=true;success.classList.add('is-visible');success.focus();
    }catch(error){status.textContent='We could not send your request. Please try again or email sara@latecheckouttravel.com.';status.classList.add('error')}
    finally{button.disabled=false;button.textContent='Request client access'}
  });
})();
