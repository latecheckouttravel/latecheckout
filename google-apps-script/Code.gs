var RECIPIENT = 'sara.rizzotti@fora.travel';
var ALLOWED_BUDGETS = ['Under $500', '$500–$999', '$1,000–$1,499', '$1,500–$2,499', '$2,500+'];

function doGet(e) { return handleRequest_(e); }
function doPost(e) { return handleRequest_(e); }

function handleRequest_(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true });

  if (p.formType === 'access') return handleAccessRequest_(p);
  if (p.formType === 'hotel') return handleHotelRequest_(p);
  return json_({ ok: false, error: 'Invalid submission.' });
}

function handleAccessRequest_(p) {

  var firstName = clean_(p.firstName, 80);
  var lastName = clean_(p.lastName, 80);
  var email = clean_(p.email, 254).toLowerCase();
  var budget = clean_(p.hotelSpend, 40);
  var helpWith = clean_(p.helpWith, 3000);
  var source = clean_(p.source, 200) || 'Direct';
  var page = clean_(p.page, 500);
  var submitted = clean_(p.submitted, 80) || new Date().toISOString();

  if (!firstName || !lastName ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || ALLOWED_BUDGETS.indexOf(budget) === -1) {
    return json_({ ok: false, error: 'Invalid submission.' });
  }

  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email);
  var rateKey = 'access-' + Utilities.base64EncodeWebSafe(digest).slice(0, 32);
  var cache = CacheService.getScriptCache();
  if (cache.get(rateKey)) return json_({ ok: false, error: 'Please wait before submitting again.' });
  cache.put(rateKey, '1', 60);

  var name = firstName + ' ' + lastName;
  var body = [
    'NEW LATE CHECKOUT ACCESS REQUEST', '',
    'Name: ' + name,
    'Email: ' + email,
    'Typical nightly hotel budget: ' + budget,
    'What they would like help with: ' + (helpWith || 'Not provided'),
    'Submitted: ' + submitted,
    'Source: ' + source,
    'Page: ' + page
  ].join('\n');

  MailApp.sendEmail({
    to: RECIPIENT,
    subject: 'New Late Checkout Access Request: ' + name,
    body: body,
    replyTo: email,
    name: 'Late Checkout Website'
  });

  return json_({ ok: true });
}

function handleHotelRequest_(p) {
  var name = clean_(p.clientName, 160);
  var email = clean_(p.clientEmail, 254).toLowerCase();
  var hotelIdea = clean_(p.hotelIdea, 500);
  var dates = clean_(p.dates, 200);
  var notes = clean_(p.notes, 3000);
  var source = clean_(p.source, 200) || 'Client Desk';
  var page = clean_(p.page, 500);
  var submitted = clean_(p.submitted, 80) || new Date().toISOString();

  if (!name || !hotelIdea || !dates || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json_({ ok: false, error: 'Invalid submission.' });
  }

  rateLimit_('hotel', email);

  var body = [
    'NEW LATE CHECKOUT HOTEL REQUEST', '',
    'Client name: ' + name,
    'Client email: ' + email,
    'Hotel or trip idea: ' + hotelIdea,
    'Dates: ' + dates,
    'Notes: ' + (notes || 'None provided'),
    'Submitted: ' + submitted,
    'Source: ' + source,
    'Page: ' + page
  ].join('\n');

  MailApp.sendEmail({
    to: RECIPIENT,
    subject: 'New Hotel Request: ' + name + ' — ' + hotelIdea.slice(0, 80),
    body: body,
    replyTo: email,
    name: 'Late Checkout Client Desk'
  });

  return json_({ ok: true });
}

function rateLimit_(formType, email) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email);
  var rateKey = formType + '-' + Utilities.base64EncodeWebSafe(digest).slice(0, 32);
  var cache = CacheService.getScriptCache();
  if (cache.get(rateKey)) throw new Error('Please wait before submitting again.');
  cache.put(rateKey, '1', 60);
}

function clean_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
