# ICS
Javascript ICS file creator &amp; downloader

## Demo sivusto
  <a href="https://hittosepi.github.io/" target="_blank">Form esimerkki</a>
## Tarvitsee 
- JQuery
## Käyttö
### Data formista
```html
<form>
  <input type="text" name="title" id="title" value="Otsikko">
  <input type="text" name="desc" id="desc" value="Tapahtuman kuvaus">
  <input type="text" name="location" id="location" value="Lahti">
  <input type="text" name="url" id="url" value="https://www.google.fi">
  <input type="datetime-local" name="start" id="startDate" value= "2021-09-16T10:12">
  <input type="datetime-local" name="end" id="end"  value= "2021-09-17T10:12">
  <a id="save" href="#">Save</a>
</form>

<script src="ics.js"></script>
<script>
  ICS.init("save");
  ICS.getFormData("form");
</script>
```
### Datan syöttö manuaalisesti
```html
<a id="save" href="#">Save</a>

<script src="ics.js"></script>
<script>
ICS.init("save");
ICS.addEvent({title: "otsikko", desc: "kuvaus", location: "Paikka", url: "webosoite", start:Date(), end: Date()});
</script>
```
