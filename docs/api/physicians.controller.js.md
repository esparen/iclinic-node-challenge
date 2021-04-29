## Members

<dl>
<dt><a href="#getPhysician">getPhysician</a> ⇒</dt>
<dd><p>retrieves the clinic data from the chache or an external service set by the enviroment configuration</p>
</dd>
<dt><a href="#requestPhysiciansAPI">requestPhysiciansAPI</a> ⇒ <code>JSON</code></dt>
<dd><p>uses Axios to make a request to the Physicians external API</p>
</dd>
<dt><a href="#formatPhysiciansApiErrors">formatPhysiciansApiErrors</a> ⇒ <code>JSON</code></dt>
<dd><p>Handles the formating of errors from calling the Physicians API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)</p>
</dd>
</dl>

<a name="getPhysician"></a>

## getPhysician ⇒
retrieves the clinic data from the chache or an external service set by the enviroment configuration

**Kind**: global variable  
**Returns**: an object with physician's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| physicianId | <code>number</code> | the id of the physician |

<a name="requestPhysiciansAPI"></a>

## requestPhysiciansAPI ⇒ <code>JSON</code>
uses Axios to make a request to the Physicians external API

**Kind**: global variable  
**Returns**: <code>JSON</code> - an object with physician's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| physicianId | <code>number</code> | the physicians ID |

<a name="formatPhysiciansApiErrors"></a>

## formatPhysiciansApiErrors ⇒ <code>JSON</code>
Handles the formating of errors from calling the Physicians API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)

**Kind**: global variable  
**Returns**: <code>JSON</code> - the object containing the information of the error  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>JSON</code> | the Axios error when the Physicians API was called |

