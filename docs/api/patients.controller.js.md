## Members

<dl>
<dt><a href="#getPatient">getPatient</a> ⇒</dt>
<dd><p>retrieves the clinic data from the chache or an external service set by the enviroment configuration</p>
</dd>
<dt><a href="#requestPatientsAPI">requestPatientsAPI</a> ⇒ <code>JSON</code></dt>
<dd><p>uses Axios to make a request to the Patients external API</p>
</dd>
<dt><a href="#formatPatientsApiErrors">formatPatientsApiErrors</a> ⇒ <code>JSON</code></dt>
<dd><p>Handles the formating of errors from calling the Patients API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)</p>
</dd>
</dl>

<a name="getPatient"></a>

## getPatient ⇒
retrieves the clinic data from the chache or an external service set by the enviroment configuration

**Kind**: global variable  
**Returns**: an object with patient's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| patientId | <code>number</code> | the id of the patient |

<a name="requestPatientsAPI"></a>

## requestPatientsAPI ⇒ <code>JSON</code>
uses Axios to make a request to the Patients external API

**Kind**: global variable  
**Returns**: <code>JSON</code> - an object with patient's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| patientId | <code>number</code> | the patients ID |

<a name="formatPatientsApiErrors"></a>

## formatPatientsApiErrors ⇒ <code>JSON</code>
Handles the formating of errors from calling the Patients API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)

**Kind**: global variable  
**Returns**: <code>JSON</code> - the object containing the information of the error  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>JSON</code> | the Axios error when the Patients API was called |

