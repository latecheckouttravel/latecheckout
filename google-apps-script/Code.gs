var RECIPIENT = 'sara.rizzotti@fora.travel';
var ALLOWED_BUDGETS = ['Under $500', '$500–$999', '$1,000–$1,499', '$1,500–$2,499', '$2,500+'];

function doGet(e) { return handleAccessRequest_(e); }
function doPost(e) { return handleAccessRequest_(e); }

function handleAccessRequest_(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true });

  var firstName = clean_(p.firstName, 80);
  var lastName = clean_(p.lastName, 80);
  var email = clean_(p.email, 254).toLowerCase();
  var employer = clean_(p.employer, 160);
  var budget = clean_(p.hotelSpend, 40);
  var source = clean_(p.source, 200) || 'Direct';
  var page = clean_(p.page, 500);
  var submitted = clean_(p.submitted, 80) || new Date().toISOString();

  if (p.formType !== 'access' || !firstName || !lastName || !employer ||
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
    'Employer: ' + employer,
    'Typical nightly hotel budget: ' + budget,
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

function clean_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
