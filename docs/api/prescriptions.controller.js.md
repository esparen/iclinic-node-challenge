## Members

<dl>
<dt><a href="#handleNewPrescription">handleNewPrescription</a></dt>
<dd><p>Handles the proccess and validations of an incoming prescription.</p>
</dd>
<dt><a href="#insertPrescription">insertPrescription</a> ⇒</dt>
<dd><p>Inserts a prescription in the MongoDB collection Prescriptions</p>
</dd>
</dl>

<a name="handleNewPrescription"></a>

## handleNewPrescription
Handles the proccess and validations of an incoming prescription.

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | the request object |
| res | <code>Object</code> | the respone object |

<a name="insertPrescription"></a>

## insertPrescription ⇒
Inserts a prescription in the MongoDB collection Prescriptions

**Kind**: global variable  
**Returns**: the response from mongoose after trying to insert the document in the collection  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> |  |
| clinic | <code>JSON</code> | Object containing the id of the clinic |
| patient | <code>JSON</code> | Object containing the id of the patient |
| physician | <code>JSON</code> | Object containing the id of the physician |

