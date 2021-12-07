
  * Virtual Keybaord: Version - v1.1.0
  * Modified by Author: Rahul Borade

Installation : 

To activate this script within an HTML document: First include the external JavaScript file, "keyboard.js" and stylesheet, "keyboard.css" within the document's <head> element

<script type="text/javascript" src="keyboard.js" charset="UTF-8"></script>
<link rel="stylesheet" type="text/css" href="keyboard.css">
Then, to enable a graphical keyboard interface on any particular text field or textarea, simply apply to it the keyboardInput class, like so:

<input type="text" value="" class="keyboardInput">

Then, when your document loads, the script will find all elements labeled with this class and automatically insert the keyboard link. Make sure that the keyboard.png image is in the right location for it to be loaded by the script! If JavaScript is disabled, the keyboard icons simply do not appear, so the script degrades gracefully. You may safely remove the keyboardInput class via scripting after the document has loaded.

This script has been tested to work in all the latest versions of: Firefox, Opera, Safari for Windows and Chrome. There is a 


Customisation
Default keyboard layout
To change the default keyboard which displays first for each different page, change the value of the this.VKI_kt variable to the name of the keyboard. For example, to make the default keyboard "Greek", change the value like so: this.VKI_kt = "Greek";.

Dead keys
To turn dead keys on by default, set the value of this.VKI_deadkeysOn to true. You can also hide the dead keys checkbox entirely by setting this.VKI_deadBox to false. This means the keyboard will be stuck in the dead keys mode which you selected as the default, either on or off.

Number pad
The number pad options are similar to those of the dead keys. To display the number pad by default when the keyboard is first opened, set the value of this.VKI_numberPadOn to true. To hide the number pad button, set this.VKI_numberPad to false. A value of false means the keyboard will be stuck in whatever display mode you selected using this.VKI_numberPadOn.

Clear passwords
To have the keyboard automatically clear password inputs when it is invoked, set the value of this.VKI_clearPasswords to true. This is mainly useful when there are characters already in the field; since users don't know what they are, it's likely they would like to start their input over.

Hide version number
To disable display of the version number in the bottom right hand corner, set the value of this.VKI_showVersion to false.

Imageless mode
By default the script will add a clickable image  next to inputs and textareas that have the keyboard interface enabled. The script supports a secondary mode that does not insert an image, but rather brings up the keyboard when the input is focused, whether by tabbing or clicking. To enable this mode, just set the value of this.VKI_imageURI to the empty string (""). This mode is useful if, for example, you don't want the keyboard icons to mess up a tightly designed page layout.

Clickless interface
To enable the clickless interface option, set the value of this.VKI_clickless to an integer greater than 0. This interface mode allows you to enter characters simply by hovering the mouse over them for a short time, which can provide an extra layer of protection from sophisticated spyware which may take screenshots on mouse-click. The value of the this.VKI_clickless variable is the amount of hover time (in milliseconds) required to activate a key. (1000 milliseconds = 1 second)

Keyboard size control
The keyboard includes a control that allows the user to adjust the size of the keyboard. Five sizes based on font-size have been pre-programmed: 9px, 11px (default), 13px, 16px and 20px; corresponding to the sizes 1 to 5 respectively. To disable the appearance of this dropdown control, set the value of this.VKI_sizeAdj to false. The value of this.VKI_size is the default size to be used by the keyboard when it first appears on a page.

To change the size of the keyboard to values other than those listed above, just change the font size in the #keyboardInputMaster * { ... } rules in the associated CSS.

Automatic layout selection
By default, the keyboard will use the lang attribute of each enabled form element in order to determine which keyboard to display. For example, if a text input contains the attribute lang="fr" then the French keyboard layout will be automatically selected by default when the keyboard is invoked. If no lang attribute exists, or a compatible keyboard layout is not found, then the default or currently selected layout will be displayed. To disable this behaviour, set the value of this.VKI_langAdapt to false.

The script uses valid two letter language codes with optional subtags, as defined in RFC 1766. You can find out which codes will trigger particular keyboards by examining the .lang property of each keyboard layout as defined in the source code.

Advanced Stuff
The script exposes the event attachment function to scripting via the global VKI_attach function. If your document creates inputs after the page has loaded, whether through Ajax processes or user interaction, you can attach the keyboard events to them by passing the element to VKI_attach. For example:

var foo = document.createElement('input');
document.body.appendChild(foo);
VKI_attach(foo);
You can only attach keyboard events to elements which have already been added to the document. Once the script has attached the keyboard events to an input or textarea element, it will set the element's .VKI_attached property to true. You can check for this property in your scripts to prevent applying the events to an input element which already has them, like so:

var myInput = document.getElementById('myInput');
if (!myInput.VKI_attached) VKI_attach(myInput);
The script also exposes the keyboard close function via the global VKI_close function. Other scripts on your pages may call this function to close the keyboard if, for example, an element which contains activated keyboard inputs is hidden by the user.

function closeDialogue() {
  document.getElementById('myDialogue').style.display = "none";
  VKI_close();
}


  

