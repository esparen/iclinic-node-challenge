## Members

<dl>
<dt><a href="#getClinic">getClinic</a> ⇒</dt>
<dd><p>retrieves the clinic data from the chache or an external service set by the enviroment configuration</p>
</dd>
<dt><a href="#requestClinicAPI">requestClinicAPI</a> ⇒ <code>JSON</code></dt>
<dd><p>uses Axios to make a request to the Clinic external API</p>
</dd>
<dt><a href="#formatClinicApiErrors">formatClinicApiErrors</a> ⇒ <code>JSON</code></dt>
<dd><p>Handles the formating of errors from calling the Clinic API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)</p>
</dd>
</dl>

<a name="getClinic"></a>

## getClinic ⇒
retrieves the clinic data from the chache or an external service set by the enviroment configuration

**Kind**: global variable  
**Returns**: an object with clinic's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| clinicId | <code>number</code> | the id of the clinic |

<a name="requestClinicAPI"></a>

## requestClinicAPI ⇒ <code>JSON</code>
uses Axios to make a request to the Clinic external API

**Kind**: global variable  
**Returns**: <code>JSON</code> - an object with clinic's data or an error  

| Param | Type | Description |
| --- | --- | --- |
| clinicId | <code>number</code> | the clinic ID |

<a name="formatClinicApiErrors"></a>

## formatClinicApiErrors ⇒ <code>JSON</code>
Handles the formating of errors from calling the Clinic API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)

**Kind**: global variable  
**Returns**: <code>JSON</code> - the object containing the information of the error  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>JSON</code> | the Axios error when the Clinic API was called |

