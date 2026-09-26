(function(){
  const dialog=document.getElementById('hotel-dialog');
  const form=document.getElementById('hotel-form');
  const status=document.getElementById('hotel-status');
  const success=document.getElementById('hotel-success');
  document.getElementById('open-hotel-form').addEventListener('click',()=>{dialog.showModal();document.body.style.overflow='hidden'});
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.style.overflow='');
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.getElementById('hotel-page').value=location.href;
  form.addEventListener('submit',async event=>{
    event.preventDefault();status.textContent='';status.className='form-status';
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('website'))return;
    document.getElementById('hotel-submitted').value=new Date().toISOString();
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Sending…';
    try{
      await fetch(form.action,{method:'POST',body:new FormData(form),mode:'no-cors'});
      form.hidden=true;success.classList.add('is-visible');success.focus();
    }catch(error){status.textContent='We could not send your request. Please try again or email hello@latecheckouttravel.com.';status.classList.add('error')}
    finally{button.disabled=false;button.textContent='Send hotel request'}
  });
})();
