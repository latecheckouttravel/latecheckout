(function(){
  const dialog=document.getElementById('access-dialog');
  const form=document.getElementById('access-form');
  const status=document.getElementById('access-status');
  const success=document.getElementById('success-state');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.js-open-access').forEach(button=>button.addEventListener('click',()=>{dialog.showModal();document.body.style.overflow='hidden'}));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.style.overflow='');
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  const params=new URLSearchParams(location.search);
  document.getElementById('referral-source').value=params.get('ref')||params.get('utm_source')||'';
  document.getElementById('submission-page').value=location.href;
  const reveals=document.querySelectorAll('.reveal');
  if(reduceMotion){reveals.forEach(el=>el.classList.add('is-visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});reveals.forEach(el=>observer.observe(el))}
  form.addEventListener('submit',async event=>{
    event.preventDefault();status.textContent='';status.className='form-status';
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('website'))return;
    document.getElementById('submission-time').value=new Date().toISOString();
    const endpoint=form.action;
    const isAppsScript=/script\.google\.com\/macros\/s\//i.test(endpoint);
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';
    try{
      if(isAppsScript){
        await fetch(endpoint,{method:'POST',body:new FormData(form),mode:'no-cors'});
      }else{
        const response=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
        if(!response.ok)throw new Error('We could not send your request. Please try again or email hello@latecheckouttravel.com.');
      }
      form.hidden=true;success.classList.add('is-visible');success.focus();
    }catch(error){status.textContent=error.message;status.classList.add('error')}
    finally{button.disabled=false;button.textContent='Request access'}
  });
})();
