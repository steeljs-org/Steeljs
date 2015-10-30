/*
 * preventDefault
 * @method core_event_preventDefault
 * @private
 * @return {Event} e 
 */
function core_event_preventDefault( event ) {
	if ( event.preventDefault ) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}
