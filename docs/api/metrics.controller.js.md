## Members

<dl>
<dt><a href="#postMetric">postMetric</a> ⇒ <code>JSON</code></dt>
<dd><p>requests an insertion on the metric external service, set on enviroment configuration</p>
</dd>
<dt><a href="#postMetricsAPI">postMetricsAPI</a> ⇒ <code>JSON</code></dt>
<dd><p>uses Axios to make a POST request to the Metrics external API</p>
</dd>
<dt><a href="#formatMetricsApiErrors">formatMetricsApiErrors</a> ⇒ <code>JSON</code></dt>
<dd><p>Handles the formating of errors from calling the Metrics API. Expected errors: 404 (not found); 429 (too many requests);  ECONNABORTED (axios timeout)</p>
</dd>
<dt><a href="#formatMetricBody">formatMetricBody</a> ⇒ <code>JSON</code></dt>
<dd><p>Composes the metrics service request body.</p>
</dd>
</dl>

<a name="postMetric"></a>

## postMetric ⇒ <code>JSON</code>
requests an insertion on the metric external service, set on enviroment configuration

**Kind**: global variable  
**Returns**: <code>JSON</code> - an object with metric service response or an error  

| Param | Type | Description |
| --- | --- | --- |
| metricBody | <code>JSON</code> | the id of the metric |

<a name="postMetricsAPI"></a>

## postMetricsAPI ⇒ <code>JSON</code>
uses Axios to make a POST request to the Metrics external API

**Kind**: global variable  
**Returns**: <code>JSON</code> - an object with metric's response or an error  

| Param | Type | Description |
| --- | --- | --- |
| metricBody | <code>JSON</code> | the metrics request body |

<a name="formatMetricsApiErrors"></a>

## formatMetricsApiErrors ⇒ <code>JSON</code>
Handles the formating of errors from calling the Metrics API. Expected errors: 404 (not found); 429 (too many requests);  ECONNABORTED (axios timeout)

**Kind**: global variable  
**Returns**: <code>JSON</code> - the object containing the information of the error  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>JSON</code> | the Axios error when the Metrics API was called |

<a name="formatMetricBody"></a>

## formatMetricBody ⇒ <code>JSON</code>
Composes the metrics service request body.

**Kind**: global variable  
**Returns**: <code>JSON</code> - a valid body for the metrics API  

| Param | Type | Description |
| --- | --- | --- |
| physicianData | <code>JSON</code> | Data from the physician external service |
| patientData | <code>JSON</code> | Data from the patient external service |
| clinicData | <code>JSON</code> | Data from the clinic external service |

