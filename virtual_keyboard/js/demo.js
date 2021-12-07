/* ********************************************************************
 **********************************************************************
 * HTML Virtual Keyboard Interface Script - v1.43
 *   Copyright (c) 2010 - GreyWyvern
 *
 *  - Licenced for free distribution under the BSDL
 *          http://www.opensource.org/licenses/bsd-license.php
 *
 * Add a script-driven keyboard interface to text fields, password
 * fields and textareas.
 *
 * See http://www.greywyvern.com/code/javascript/keyboard for examples
 * and usage instructions.
 *
 * Version 1.43 - October 29, 2010
 *   - Added Dingbats and Misc. Symbols layouts
 *   - Keyboard closes if a non-active form element is clicked
 *   - Added dropdown indicator arrow beside layout name
 *
 *   See full changelog at:
 *     http://www.greywyvern.com/code/javascript/keyboard.changelog.txt
 * 
 ** Changes by Martin Podolak on top of version 1.43:
 ** 2019-05-01 merged keyboard_ru-ocs.js and keyboard_am_ti.js into this file (keyboard.js)
 ** 2019-04-30 Turkmen, Crimean Tatar added, Turkish Q, Ukrainian and Russian updated, Russian extended with old characters and an own meta key for that: "yat"
 ** 2019-04-29 Old Church Slavonic (+dead keys) and Glagolitic added, Bulgarian and Serbian updated
 ** 2019-03-07 Amharic and Tigrinya keyboard added (+dead keys)
 *
 * Keyboard Credits
 **  - Amharic, Tigrinya, Turkmen, Crimean Tatar, Old Church Slavonic, Glagolitic, Russian extended keyboard layouts by Martin Podolak (podolak.net)
 *   - Khmer keyboard layout by Sovann Heng (km-kh.com)
 *   - Dari keyboard layout by Saif Fazel
 *   - Kurdish keyboard layout by Ara Qadir
 *   - Assamese keyboard layout by Kanchan Gogoi
 *   - Bulgarian BDS keyboard layout by Milen Georgiev
 *   - Basic Japanese Hiragana/Katakana keyboard layout by Damjan
 *   - Ukrainian keyboard layout by Dmitry Nikitin
 *   - Macedonian keyboard layout by Damjan Dimitrioski
 *   - Pashto keyboard layout by Ahmad Wali Achakzai (qamosona.com)
 *   - Armenian Eastern and Western keyboard layouts by Hayastan Project (www.hayastan.co.uk)
 *   - Pinyin keyboard layout from a collaboration with Lou Winklemann
 *   - Kazakh keyboard layout by Alex Madyankin
 *   - Danish keyboard layout by Verner Kjærsgaard
 *   - Slovak keyboard layout by Daniel Lara (www.learningslovak.com)
 *   - Belarusian and Serbian Cyrillic keyboard layouts by Evgeniy Titov
 *   - Bulgarian Phonetic keyboard layout by Samuil Gospodinov
 *   - Swedish keyboard layout by Håkan Sandberg
 *   - Romanian keyboard layout by Aurel
 *   - Farsi (Persian) keyboard layout by Kaveh Bakhtiyari (www.bakhtiyari.com)
 *   - Burmese keyboard layout by Cetanapa
 *   - Bosnian/Croatian/Serbian Latin/Slovenian keyboard layout by Miran Zeljko
 *   - Hungarian keyboard layout by Antal Sall 'Hiromacu'
 *   - Arabic keyboard layout by Srinivas Reddy
 *   - Italian and Spanish (Spain) keyboard layouts by dictionarist.com
 *   - Lithuanian and Russian keyboard layouts by Ramunas
 *   - German keyboard layout by QuHno
 *   - French keyboard layout by Hidden Evil
 *   - Polish Programmers layout by moose
 *   - Turkish keyboard layouts by offcu
 *   - Dutch and US Int'l keyboard layouts by jerone
 *
 */
var VKI_attach, VKI_close;
(function VKI_buildKeyboardInputs() {
  var self = this;

  this.VKI_version = "1.02";
  this.VKI_showVersion = false;
  this.VKI_target = false;
  this.VKI_shift = this.VKI_shiftlock = false;
  this.VKI_altgr = this.VKI_altgrlock = false;
  this.VKI_dead = false;
  this.VKI_deadBox = true; // Show the dead keys checkbox
  this.VKI_deadkeysOn = true;  // Turn dead keys on by default
  this.VKI_numberPad = false;  // Allow user to open and close the number pad
  this.VKI_numberPadOn = false;  // Show number pad by default
//  this.VKI_kts = this.VKI_kt = "US International";  // Default keyboard layout
if (typeof kblang === 'undefined') {
  this.VKI_kts = this.VKI_kt = "English";
}  if (typeof kblang !== 'undefined') {
  this.VKI_kts = this.VKI_kt = kblang;
} else {
  this.VKI_kts = this.VKI_kt = "English";
}  
  this.VKI_langAdapt = false;  // Use lang attribute of input to select keyboard
  this.VKI_size = 4;  // Default keyboard size (1-5)
  this.VKI_sizeAdj = true;  // Allow user to adjust keyboard size
  this.VKI_clearPasswords = false;  // Clear password fields on focus
  this.VKI_imageURI = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAANAgMAAADH6eY5AAAADFBMVEUAAADAwMD///+AgID8PoY4AAAAUElEQVR4Xk3KsQ2AIBCF4TcEbHCVe1hoZ3IsZhyBRqdgCNzAwrgEHncGfHnVnw/FhmudSI68jE6OBNujecOpmVu/q5/j5/nnh2OnKN6H0P0LmzYfoht62vIAAAAASUVORK5CYII=";  // If empty string, use imageless mode
  this.VKI_clickless = 0;  // 0 = disabled, > 0 = delay in ms
  this.VKI_keyCenter = 3;

  this.VKI_isIE = /*@cc_on!@*/false;
  this.VKI_isIE6 = /*@if(@_jscript_version == 5.6)!@end@*/false;
  this.VKI_isIElt8 = /*@if(@_jscript_version < 5.8)!@end@*/false;
  this.VKI_isWebKit = RegExp("KHTML").test(navigator.userAgent);
  this.VKI_isOpera = RegExp("Opera").test(navigator.userAgent);
  this.VKI_isMoz = (!this.VKI_isWebKit && navigator.product == "Gecko");

  /* ***** i18n text strings ************************************* */
  this.VKI_i18n = {
    '00': "Display Number Pad",
    '01': "Display virtual keyboard interface",
    '02': "Select keyboard layout",
    '03': "Dead keys",
    '04': "on",
    '05': "off",
    '06': "Close the keyboard",
    '07': "Clear",
    '08': "Clear this input",
    '09': "Version",
    '10': "Decrease keyboard size",
    '11': "Increase keyboard size"
  };


  /* ***** Create keyboards ************************************** */
  this.VKI_layout = {};

  // - Lay out each keyboard in rows of sub-arrays.  Each sub-array
  //   represents one key.
  //
  // - Each sub-array consists of four slots described as follows:
  //     example: ["a", "A", "\u00e1", "\u00c1"]
  //
  //          a) Normal character
  //          A) Character + Shift/Caps
  //     \u00e1) Character + Alt/AltGr/AltLk
  //     \u00c1) Character + Shift/Caps + Alt/AltGr/AltLk
  //
  //   You may include sub-arrays which are fewer than four slots.
  //   In these cases, the missing slots will be blanked when the
  //   corresponding modifier key (Shift or AltGr) is pressed.
  //
  // - If the second slot of a sub-array matches one of the following
  //   strings:
  //     "Tab", "Caps", "Shift", "Enter", "Bksp",
  //     "Alt" OR "AltGr", "AltLk"
  //   then the function of the key will be the following,
  //   respectively:
  //     - Insert a tab
  //     - Toggle Caps Lock (technically a Shift Lock)
  //     - Next entered character will be the shifted character
  //     - Insert a newline (textarea), or close the keyboard
  //     - Delete the previous character
  //     - Next entered character will be the alternate character
  //     - Toggle Alt/AltGr Lock
  //
  //   The first slot of this sub-array will be the text to display
  //   on the corresponding key.  This allows for easy localisation
  //   of key names.
  //
  // - Layout dead keys (diacritic + letter) should be added as
  //   property/value pairs of objects with hash keys equal to the
  //   diacritic.  See the "this.VKI_deadkey" object below the layout
  //   definitions.  In each property/value pair, the value is what
  //   the diacritic would change the property name to.
  //
  // - Note that any characters beyond the normal ASCII set should be
  //   entered in escaped Unicode format.  (eg \u00a3 = Pound symbol)
  //   You can find Unicode values for characters here:
  //     http://unicode.org/charts/
  //
  // - To remove a keyboard, just delete it, or comment it out of the
  //   source code. If you decide to remove the US International
  //   keyboard layout, make sure you change the default layout
  //   (this.VKI_kt) above so it references an existing layout.

  

  this.VKI_layout['\u0985\u09b8\u09ae\u09c0\u09df\u09be'] = {
    'name': "Assamese", 'keys': [
      [["+", "?"], ["\u09E7", "{", "\u09E7"], ["\u09E8", "}", "\u09E8"], ["\u09E9", "\u09CD\u09F0", "\u09E9"], ["\u09EA", "\u09F0\u09CD", "\u09EA"], ["\u09EB", "\u099C\u09CD\u09F0", "\u09EB"], ["\u09EC", "\u0995\u09CD\u09B7", "\u09EC"], ["\u09ED", "\u0995\u09CD\u09F0", "\u09ED"], ["\u09EE", "\u09B6\u09CD\u09F0", "\u09EE"], ["\u09EF", "(", "\u09EF"], ["\u09E6", ")", "\u09E6"], ["-", ""], ["\u09C3", "\u098B", "\u09E2", "\u09E0"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u09CC", "\u0994", "\u09D7"], ["\u09C8", "\u0990"], ["\u09BE", "\u0986"], ["\u09C0", "\u0988", "\u09E3", "\u09E1"], ["\u09C2", "\u098A"], ["\u09F1", "\u09AD"], ["\u09B9", "\u0999"], ["\u0997", "\u0998"], ["\u09A6", "\u09A7"], ["\u099C", "\u099D"], ["\u09A1", "\u09A2", "\u09DC", "\u09DD"], ["Enter", "Enter"]],
      [["Caps", "Caps"], ["\u09CB", "\u0993", "\u09F4", "\u09F5"], ["\u09C7", "\u098F", "\u09F6", "\u09F7"], ["\u09CD", "\u0985", "\u09F8", "\u09F9"], ["\u09BF", "\u0987", "\u09E2", "\u098C"], ["\u09C1", "\u0989"], ["\u09AA", "\u09AB"], ["\u09F0", "", "\u09F0", "\u09F1"], ["\u0995", "\u0996"], ["\u09A4", "\u09A5"], ["\u099A", "\u099B"], ["\u099F", "\u09A0"], ["\u09BC", "\u099E"]],
      [["Shift", "Shift"], ["\u09CE", "\u0983"], ["\u0982", "\u0981", "\u09FA"], ["\u09AE", "\u09A3"], ["\u09A8", "\u09F7"], ["\u09AC", "\""], ["\u09B2", "'"], ["\u09B8", "\u09B6"], [",", "\u09B7"], [".", ";"], ["\u09AF", "\u09DF"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["as"] };

  
  this.VKI_layout['\u09ac\u09be\u0982\u09b2\u09be'] = {
    'name': "Bengali", 'keys': [
      [[""], ["1", "", "\u09E7"], ["2", "", "\u09E8"], ["3", "\u09CD\u09B0", "\u09E9"], ["4", "\u09B0\u09CD", "\u09EA"], ["5", "\u099C\u09CD\u09B0", "\u09EB"], ["6", "\u09A4\u09CD\u09B7", "\u09EC"], ["7", "\u0995\u09CD\u09B0", "\u09ED"], ["8", "\u09B6\u09CD\u09B0", "\u09EE"], ["9", "(", "\u09EF"], ["0", ")", "\u09E6"], ["-", "\u0983"], ["\u09C3", "\u098B", "\u09E2", "\u09E0"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u09CC", "\u0994", "\u09D7"], ["\u09C8", "\u0990"], ["\u09BE", "\u0986"], ["\u09C0", "\u0988", "\u09E3", "\u09E1"], ["\u09C2", "\u098A"], ["\u09AC", "\u09AD"], ["\u09B9", "\u0999"], ["\u0997", "\u0998"], ["\u09A6", "\u09A7"], ["\u099C", "\u099D"], ["\u09A1", "\u09A2", "\u09DC", "\u09DD"], ["Enter", "Enter"]],
      [["Caps", "Caps"], ["\u09CB", "\u0993", "\u09F4", "\u09F5"], ["\u09C7", "\u098F", "\u09F6", "\u09F7"], ["\u09CD", "\u0985", "\u09F8", "\u09F9"], ["\u09BF", "\u0987", "\u09E2", "\u098C"], ["\u09C1", "\u0989"], ["\u09AA", "\u09AB"], ["\u09B0", "", "\u09F0", "\u09F1"], ["\u0995", "\u0996"], ["\u09A4", "\u09A5"], ["\u099A", "\u099B"], ["\u099F", "\u09A0"], ["\u09BC", "\u099E"]],
      [["Shift", "Shift"], [""], ["\u0982", "\u0981", "\u09FA"], ["\u09AE", "\u09A3"], ["\u09A8"], ["\u09AC"], ["\u09B2"], ["\u09B8", "\u09B6"], [",", "\u09B7"], [".", "{"], ["\u09AF", "\u09DF"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["bn"] };


 

   this.VKI_layout['English'] = {
    'name': "English", 'keys': [
      [["`", "~"], ["1", "!", "\u00a1", "\u00b9"], ["2", "@", "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00a4", "\u00a3"], ["5", "%", "\u20ac"], ["6", "^", "\u00bc"], ["7", "&", "\u00bd"], ["8", "*", "\u00be"], ["9", "(", "\u2018"], ["0", ")", "\u2019"], ["-", "_", "\u00a5"], ["=", "+", "\u00d7", "\u00f7"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q", "\u00e4", "\u00c4"], ["w", "W", "\u00e5", "\u00c5"], ["e", "E", "\u00e9", "\u00c9"], ["r", "R", "\u00ae"], ["t", "T", "\u00fe", "\u00de"], ["y", "Y", "\u00fc", "\u00dc"], ["u", "U", "\u00fa", "\u00da"], ["i", "I", "\u00ed", "\u00cd"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P", "\u00f6", "\u00d6"], ["[", "{", "\u00ab"], ["]", "}", "\u00bb"], ["\\", "|", "\u00ac", "\u00a6"]],
      [["Caps", "Caps"], ["a", "A", "\u00e1", "\u00c1"], ["s", "S", "\u00df", "\u00a7"], ["d", "D", "\u00f0", "\u00d0"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L", "\u00f8", "\u00d8"], [";", ":", "\u00b6", "\u00b0"], ["'", '"', "\u00b4", "\u00a8"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["z", "Z", "\u00e6", "\u00c6"], ["x", "X"], ["c", "C", "\u00a9", "\u00a2"], ["v", "V"], ["b", "B"], ["n", "N", "\u00f1", "\u00d1"], ["m", "M", "\u00b5"], [",", "<", "\u00e7", "\u00c7"], [".", ">"], ["/", "?", "\u00bf"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["Alt", "Alt"]]
    ], 'lang': ["en"] };

 

  this.VKI_layout['\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0'] = {
    'name': "Gujarati", 'keys': [
      [[""], ["1", "\u0A8D", "\u0AE7"], ["2", "\u0AC5", "\u0AE8"], ["3", "\u0ACD\u0AB0", "\u0AE9"], ["4", "\u0AB0\u0ACD", "\u0AEA"], ["5", "\u0A9C\u0ACD\u0A9E", "\u0AEB"], ["6", "\u0AA4\u0ACD\u0AB0", "\u0AEC"], ["7", "\u0A95\u0ACD\u0AB7", "\u0AED"], ["8", "\u0AB6\u0ACD\u0AB0", "\u0AEE"], ["9", "(", "\u0AEF"], ["0", ")", "\u0AE6"], ["-", "\u0A83"], ["\u0AC3", "\u0A8B", "\u0AC4", "\u0AE0"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0ACC", "\u0A94"], ["\u0AC8", "\u0A90"], ["\u0ABE", "\u0A86"], ["\u0AC0", "\u0A88"], ["\u0AC2", "\u0A8A"], ["\u0AAC", "\u0AAD"], ["\u0AB9", "\u0A99"], ["\u0A97", "\u0A98"], ["\u0AA6", "\u0AA7"], ["\u0A9C", "\u0A9D"], ["\u0AA1", "\u0AA2"], ["\u0ABC", "\u0A9E"], ["\u0AC9", "\u0A91"]],
      [["Caps", "Caps"], ["\u0ACB", "\u0A93"], ["\u0AC7", "\u0A8F"], ["\u0ACD", "\u0A85"], ["\u0ABF", "\u0A87"], ["\u0AC1", "\u0A89"], ["\u0AAA", "\u0AAB"], ["\u0AB0"], ["\u0A95", "\u0A96"], ["\u0AA4", "\u0AA5"], ["\u0A9A", "\u0A9B"], ["\u0A9F", "\u0AA0"], ["Enter", "Enter"]],
      [["Shift", "Shift"], [""], ["\u0A82", "\u0A81", "", "\u0AD0"], ["\u0AAE", "\u0AA3"], ["\u0AA8"], ["\u0AB5"], ["\u0AB2", "\u0AB3"], ["\u0AB8", "\u0AB6"], [",", "\u0AB7"], [".", "\u0964", "\u0965", "\u0ABD"], ["\u0AAF"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["gu"] };

 

  this.VKI_layout['\u0926\u0947\u0935\u0928\u093e\u0917\u0930\u0940'] = {
    'name': "Devanagari", 'keys': [
      [["\u094A", "\u0912"], ["1", "\u090D", "\u0967"], ["2", "\u0945", "\u0968"], ["3", "\u094D\u0930", "\u0969"], ["4", "\u0930\u094D", "\u096A"], ["5", "\u091C\u094D\u091E", "\u096B"], ["6", "\u0924\u094D\u0930", "\u096C"], ["7", "\u0915\u094D\u0937", "\u096D"], ["8", "\u0936\u094D\u0930", "\u096E"], ["9", "(", "\u096F"], ["0", ")", "\u0966"], ["-", "\u0903"], ["\u0943", "\u090B", "\u0944", "\u0960"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u094C", "\u0914"], ["\u0948", "\u0910"], ["\u093E", "\u0906"], ["\u0940", "\u0908", "\u0963", "\u0961"], ["\u0942", "\u090A"], ["\u092C", "\u092D"], ["\u0939", "\u0919"], ["\u0917", "\u0918", "\u095A"], ["\u0926", "\u0927"], ["\u091C", "\u091D", "\u095B"], ["\u0921", "\u0922", "\u095C", "\u095D"], ["\u093C", "\u091E"], ["\u0949", "\u0911"]],
      [["Caps", "Caps"], ["औ", "\u0913"], ["\u0947", "\u090F"], ["\u094D", "\u0905"], ["\u093F", "\u0907", "\u0962", "\u090C"], ["\u0941", "\u0909"], ["\u092A", "\u092B", "", "\u095E"], ["\u0930", "\u0931"], ["\u0915", "\u0916", "\u0958", "\u0959"], ["\u0924", "\u0925"], ["\u091A", "\u091B", "\u0952"], ["\u091F", "\u0920", "", "\u0951"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0946", "\u090E", "\u0953"], ["\u0902", "\u0901", "", "\u0950"], ["\u092E", "\u0923", "\u0954"], ["\u0928", "\u0929"], ["\u0935", "\u0934"], ["\u0932", "\u0933"], ["\u0938", "\u0936"], [",", "\u0937", "\u0970"], [".", "\u0964", "\u0965", "\u093D"], ["\u092F", "\u095F"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["hi-Deva"] };

  this.VKI_layout['\u0939\u093f\u0902\u0926\u0940'] = {
    'name': "Hindi", 'keys': [
      [["", "", "", ""], ["\u0967", "\u090D", "\u200D", ""], ["\u0968", "\u0945", "\u200C", ""], ["\u0969", "\u094D\u0930", "", ""], ["\u096A", "\u0930\u094D", "\u20B9", ""], ["\u096B", "\u091C\u094D\u091E", "", ""], ["\u096C", "\u0924\u094D\u0930", "", ""], ["\u096D", "\u0915\u094D\u0937", "", ""], ["\u096E", "\u0936\u094D\u0930", "", ""], ["\u096F", "(", "", ""], ["\u0966", ")", "", ""], ["-", "\u0903", "", ""], ["\u0943", "\u090B", "\u0944", "\u0960"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u094C", "\u0914"], ["\u0948", "\u0910"], ["\u093E", "\u0906"], ["\u0940", "\u0908", "\u0963", "\u0961"], ["\u0942", "\u090A"], ["\u092C", "\u092D"], ["\u0939", "\u0919"], ["\u0917", "\u0918", "\u095A"], ["\u0926", "\u0927"], ["\u091C", "\u091D", "\u095B"], ["\u0921", "\u0922", "\u095C", "\u095D"], ["\u093C", "\u091E"], ["\u0949", "\u0911"]],
      [["Caps", "Caps"], ["\u0914", "\u0913"], ["\u0947", "\u090F"], ["\u094D", "\u0905","\u0952"], ["\u093F", "\u0907", "\u0962", "\u090C"], ["\u0941", "\u0909"], ["\u092A", "\u092B", "", "\u095E"], ["\u0930", "\u0931"], ["\u0915", "\u0916", "\u0958", "\u0959"], ["\u0924", "\u0925"], ["\u091A", "\u091B"], ["\u091F", "\u0920", "", ""], ["Enter", "Enter"]],
      [["Shift", "Shift"], [""], ["\u0902", "\u0901", "", "\u0950"], ["\u092E", "\u0923"], ["\u0928"], ["\u0935"], ["\u0932", "","","\u0933"], ["\u0938", "\u0936"], [",", "\u0937", "\u0966", ""], [".", "\u0964", "\u0965", "\u093D"], ["\u092F", "", "", ""], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["hi"] };

 

  this.VKI_layout['\u0c95\u0ca8\u0ccd\u0ca8\u0ca1'] = {
    'name': "Kannada", 'keys': [
      [["\u0CCA", "\u0C92"], ["1", "", "\u0CE7"], ["2", "", "\u0CE8"], ["3", "\u0CCD\u0CB0", "\u0CE9"], ["4", "\u0CB0\u0CCD", "\u0CEA"], ["5", "\u0C9C\u0CCD\u0C9E", "\u0CEB"], ["6", "\u0CA4\u0CCD\u0CB0", "\u0CEC"], ["7", "\u0C95\u0CCD\u0CB7", "\u0CED"], ["8", "\u0CB6\u0CCD\u0CB0", "\u0CEE"], ["9", "(", "\u0CEF"], ["0", ")", "\u0CE6"], ["-", "\u0C83"], ["\u0CC3", "\u0C8B", "\u0CC4", "\u0CE0"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0CCC", "\u0C94"], ["\u0CC8", "\u0C90", "\u0CD6"], ["\u0CBE", "\u0C86"], ["\u0CC0", "\u0C88", "", "\u0CE1"], ["\u0CC2", "\u0C8A"], ["\u0CAC", "\u0CAD"], ["\u0CB9", "\u0C99"], ["\u0C97", "\u0C98"], ["\u0CA6", "\u0CA7"], ["\u0C9C", "\u0C9D"], ["\u0CA1", "\u0CA2"], ["Enter", "Enter"]],
      [["Caps", "Caps"], ["\u0CCB", "\u0C93"], ["\u0CC7", "\u0C8F", "\u0CD5"], ["\u0CCD", "\u0C85"], ["\u0CBF", "\u0C87", "", "\u0C8C"], ["\u0CC1", "\u0C89"], ["\u0CAA", "\u0CAB", "", "\u0CDE"], ["\u0CB0", "\u0CB1"], ["\u0C95", "\u0C96"], ["\u0CA4", "\u0CA5"], ["\u0C9A", "\u0C9B"], ["\u0C9F", "\u0CA0"], ["", "\u0C9E"]],
      [["Shift", "Shift"], ["\u0CC6", "\u0C8F"], ["\u0C82"], ["\u0CAE", "\u0CA3"], ["\u0CA8"], ["\u0CB5"], ["\u0CB2", "\u0CB3"], ["\u0CB8", "\u0CB6"], [",", "\u0CB7"], [".", "|"], ["\u0CAF"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["kn"] };


  this.VKI_layout['\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02'] = {
    'name': "Malayalam", 'keys': [
      [["\u0D4A", "\u0D12"], ["1", "", "\u0D67"], ["2", "", "\u0D68"], ["3", "\u0D4D\u0D30", "\u0D69"], ["4", "", "\u0D6A"], ["5", "", "\u0D6B"], ["6", "", "\u0D6C"], ["7", "\u0D15\u0D4D\u0D37", "\u0D6D"], ["8", "", "\u0D6E"], ["9", "(", "\u0D6F"], ["0", ")", "\u0D66"], ["-", "\u0D03"], ["\u0D43", "\u0D0B", "", "\u0D60"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0D4C", "\u0D14", "\u0D57"], ["\u0D48", "\u0D10"], ["\u0D3E", "\u0D06"], ["\u0D40", "\u0D08", "", "\u0D61"], ["\u0D42", "\u0D0A"], ["\u0D2C", "\u0D2D"], ["\u0D39", "\u0D19"], ["\u0D17", "\u0D18"], ["\u0D26", "\u0D27"], ["\u0D1C", "\u0D1D"], ["\u0D21", "\u0D22"], ["", "\u0D1E"]],
      [["Caps", "Caps"], ["\u0D4B", "\u0D13"], ["\u0D47", "\u0D0F"], ["\u0D4D", "\u0D05", "", "\u0D0C"], ["\u0D3F", "\u0D07"], ["\u0D41", "\u0D09"], ["\u0D2A", "\u0D2B"], ["\u0D30", "\u0D31"], ["\u0D15", "\u0D16"], ["\u0D24", "\u0D25"], ["\u0D1A", "\u0D1B"], ["\u0D1F", "\u0D20"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0D46", "\u0D0F"], ["\u0D02"], ["\u0D2E", "\u0D23"], ["\u0D28"], ["\u0D35", "\u0D34"], ["\u0D32", "\u0D33"], ["\u0D38", "\u0D36"], [",", "\u0D37"], ["."], ["\u0D2F"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["ml"] };


  this.VKI_layout['\u092e\u0930\u093e\u0920\u0940'] = {
    'name': "Marathi", 'keys': [
      [["", "", "", ""], ["\u0967", "\u090D", "\u200D", ""], ["\u0968", "\u0945", "\u200C", ""], ["\u0969", "\u094D\u0930", "", ""], ["\u096A", "\u0930\u094D", "\u20B9", ""], ["\u096B", "\u091C\u094D\u091E", "", ""], ["\u096C", "\u0924\u094D\u0930", "", ""], ["\u096D", "\u0915\u094D\u0937", "", ""], ["\u096E", "\u0936\u094D\u0930", "", ""], ["\u096F", "(", "", ""], ["\u0966", ")", "", ""], ["-", "\u0903", "", ""], ["\u0943", "\u090B", "\u0944", "\u0960"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u094C", "\u0914"], ["\u0948", "\u0910"], ["\u093E", "\u0906"], ["\u0940", "\u0908", "\u0963", "\u0961"], ["\u0942", "\u090A"], ["\u092C", "\u092D"], ["\u0939", "\u0919"], ["\u0917", "\u0918", ""], ["\u0926", "\u0927"], ["\u091C", "\u091D", ""], ["\u0921", "\u0922", "", ""], ["\u093C", "\u091E"], ["\u0949", "\u0911"]],
      [["Caps", "Caps"], ["औ", "\u0913"], ["\u0947", "\u090F"], ["\u094D", "\u0905","\u0952"], ["\u093F", "\u0907", "\u0962", "\u090C"], ["\u0941", "\u0909"], ["\u092A", "\u092B", "", ""], ["\u0930", "\u0931"], ["\u0915", "\u0916", "", ""], ["\u0924", "\u0925"], ["\u091A", "\u091B"], ["\u091F", "\u0920", "", ""], ["Enter", "Enter"]],
      [["Shift", "Shift"], [""], ["\u0902", "\u0901", "", "\u0950"], ["\u092E", "\u0923"], ["\u0928"], ["\u0935"], ["\u0932", "\u0933"], ["\u0938", "\u0936"], [",", "\u0937", "\u0966", ""], [".", "\u0964", "\u0965", "\u093D"], ["", "\u095F", "", ""], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["mr"] };

  this.VKI_layout['\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40'] = {
    'name': "Punjabi (Gurmukhi)", 'keys': [
      [[""], ["1", "\u0A4D\u0A35", "\u0A67", "\u0A67"], ["2", "\u0A4D\u0A2F", "\u0A68", "\u0A68"], ["3", "\u0A4D\u0A30", "\u0A69", "\u0A69"], ["4", "\u0A71", "\u0A6A", "\u0A6A"], ["5", "", "\u0A6B", "\u0A6B"], ["6", "", "\u0A6C", "\u0A6C"], ["7", "", "\u0A6D", "\u0A6D"], ["8", "", "\u0A6E", "\u0A6E"], ["9", "(", "\u0A6F", "\u0A6F"], ["0", ")", "\u0A66", "\u0A66"], ["-"], [""], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0A4C", "\u0A14"], ["\u0A48", "\u0A10"], ["\u0A3E", "\u0A06"], ["\u0A40", "\u0A08"], ["\u0A42", "\u0A0A"], ["\u0A2C", "\u0A2D"], ["\u0A39", "\u0A19"], ["\u0A17", "\u0A18", "\u0A5A", "\u0A5A"], ["\u0A26", "\u0A27"], ["\u0A1C", "\u0A1D", "\u0A5B", "\u0A5B"], ["\u0A21", "\u0A22", "\u0A5C", "\u0A5C"], ["Enter", "Enter"]],
      [["Caps", "Caps"], ["\u0A4B", "\u0A13"], ["\u0A47", "\u0A0F"], ["\u0A4D", "\u0A05"], ["\u0A3F", "\u0A07"], ["\u0A41", "\u0A09"], ["\u0A2A", "\u0A2B", "\u0A5E", "\u0A5E"], ["\u0A30"], ["\u0A15", "\u0A16", "\u0A59", "\u0A59"], ["\u0A24", "\u0A25"], ["\u0A1A", "\u0A1B"], ["\u0A1F", "\u0A20"], ["\u0A3C", "\u0A1E"]],
      [["Shift", "Shift"], [""], ["\u0A02", "\u0A02"], ["\u0A2E", "\u0A23"], ["\u0A28"], ["\u0A35", "\u0A72", "\u0A73", "\u0A73"], ["\u0A32", "\u0A33"], ["\u0A38", "\u0A36"], [","], [".", "|", "\u0965", "\u0965"], ["\u0A2F"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["pa"] };


  this.VKI_layout['\u0ba4\u0bae\u0bbf\u0bb4\u0bcd'] = {
    'name': "Tamil", 'keys': [
      [["\u0BCA", "\u0B92"], ["1", "", "\u0BE7"], ["2", "", "\u0BE8"], ["3", "", "\u0BE9"], ["4", "", "\u0BEA"], ["5", "", "\u0BEB"], ["6", "\u0BA4\u0BCD\u0BB0", "\u0BEC"], ["7", "\u0B95\u0BCD\u0BB7", "\u0BED"], ["8", "\u0BB7\u0BCD\u0BB0", "\u0BEE"], ["9", "", "\u0BEF"], ["0", "", "\u0BF0"], ["-", "\u0B83", "\u0BF1"], ["", "", "\u0BF2"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0BCC", "\u0B94"], ["\u0BC8", "\u0B90"], ["\u0BBE", "\u0B86"], ["\u0BC0", "\u0B88"], ["\u0BC2", "\u0B8A"], ["\u0BAA", "\u0BAA"], ["\u0BB9", "\u0B99"], ["\u0B95", "\u0B95"], ["\u0BA4", "\u0BA4"], ["\u0B9C", "\u0B9A"], ["\u0B9F", "\u0B9F"], ["\u0B9E"]],
      [["Caps", "Caps"], ["\u0BCB", "\u0B93"], ["\u0BC7", "\u0B8F"], ["\u0BCD", "\u0B85"], ["\u0BBF", "\u0B87"], ["\u0BC1", "\u0B89"], ["\u0BAA", "\u0BAA"], ["\u0BB0", "\u0BB1"], ["\u0B95", "\u0B95"], ["\u0BA4", "\u0BA4"], ["\u0B9A", "\u0B9A"], ["\u0B9F", "\u0B9F"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0BC6", "\u0B8E"], [""], ["\u0BAE", "\u0BA3"], ["\u0BA8", "\u0BA9"], ["\u0BB5", "\u0BB4"], ["\u0BB2", "\u0BB3"], ["\u0BB8", "\u0BB7"], [",", "\u0BB7"], [".", "\u0BB8\u0BCD\u0BB0\u0BC0"], ["\u0BAF", "\u0BAF"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["ta"] };

  this.VKI_layout['\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41'] = {
    'name': "Telugu", 'keys': [
      [["\u0C4A", "\u0C12"], ["1", "", "\u0C67"], ["2", "", "\u0C68"], ["3", "\u0C4D\u0C30", "\u0C69"], ["4", "", "\u0C6A"], ["5", "\u0C1C\u0C4D\u0C1E", "\u0C6B"], ["6", "\u0C24\u0C4D\u0C30", "\u0C6C"], ["7", "\u0C15\u0C4D\u0C37", "\u0C6D"], ["8", "\u0C36\u0C4D\u0C30", "\u0C6E"], ["9", "(", "\u0C6F"], ["0", ")", "\u0C66"], ["-", "\u0C03"], ["\u0C43", "\u0C0B", "\u0C44"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0C4C", "\u0C14"], ["\u0C48", "\u0C10", "\u0C56"], ["\u0C3E", "\u0C06"], ["\u0C40", "\u0C08", "", "\u0C61"], ["\u0C42", "\u0C0A"], ["\u0C2C"], ["\u0C39", "\u0C19"], ["\u0C17", "\u0C18"], ["\u0C26", "\u0C27"], ["\u0C1C", "\u0C1D"], ["\u0C21", "\u0C22"], ["", "\u0C1E"]],
      [["Caps", "Caps"], ["\u0C4B", "\u0C13"], ["\u0C47", "\u0C0F", "\u0C55"], ["\u0C4D", "\u0C05"], ["\u0C3F", "\u0C07", "", "\u0C0C"], ["\u0C41", "\u0C09"], ["\u0C2A", "\u0C2B"], ["\u0C30", "\u0C31"], ["\u0C15", "\u0C16"], ["\u0C24", "\u0C25"], ["\u0C1A", "\u0C1B"], ["\u0C1F", "\u0C25"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0C46", "\u0C0E"], ["\u0C02", "\u0C01"], ["\u0C2E", "\u0C23"], ["\u0C28", "\u0C28"], ["\u0C35"], ["\u0C32", "\u0C33"], ["\u0C38", "\u0C36"], [",", "\u0C37"], ["."], ["\u0C2F"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["te"] };


  /* ***** Define Dead Keys ************************************** */
  this.VKI_deadkey = {};

  // - Lay out each dead key set as an object of property/value
  //   pairs.  The rows below are wrapped so uppercase letters are
  //   below their lowercase equivalents.
  //
  // - The property name is the letter pressed after the diacritic.
  //   The property value is the letter this key-combo will generate.
  //
  // - Note that if you have created a new keyboard layout and want
  //   it included in the distributed script, PLEASE TELL ME if you
  //   have added additional dead keys to the ones below.

  this.VKI_deadkey['"'] = this.VKI_deadkey['\u00a8'] = this.VKI_deadkey['\u309B'] = { // Umlaut / Diaeresis / Greek Dialytika / Hiragana/Katakana Voiced Sound Mark
    'a': "\u00e4", 'e': "\u00eb", 'i': "\u00ef", 'o': "\u00f6", 'u': "\u00fc", 'y': "\u00ff", '\u03b9': "\u03ca", '\u03c5': "\u03cb", '\u016B': "\u01D6", '\u00FA': "\u01D8", '\u01D4': "\u01DA", '\u00F9': "\u01DC",
    'A': "\u00c4", 'E': "\u00cb", 'I': "\u00cf", 'O': "\u00d6", 'U': "\u00dc", 'Y': "\u0178", '\u0399': "\u03aa", '\u03a5': "\u03ab", '\u016A': "\u01D5", '\u00DA': "\u01D7", '\u01D3': "\u01D9", '\u00D9': "\u01DB",
    '\u304b': "\u304c", '\u304d': "\u304e", '\u304f': "\u3050", '\u3051': "\u3052", '\u3053': "\u3054", '\u305f': "\u3060", '\u3061': "\u3062", '\u3064': "\u3065", '\u3066': "\u3067", '\u3068': "\u3069",
    '\u3055': "\u3056", '\u3057': "\u3058", '\u3059': "\u305a", '\u305b': "\u305c", '\u305d': "\u305e", '\u306f': "\u3070", '\u3072': "\u3073", '\u3075': "\u3076", '\u3078': "\u3079", '\u307b': "\u307c",
    '\u30ab': "\u30ac", '\u30ad': "\u30ae", '\u30af': "\u30b0", '\u30b1': "\u30b2", '\u30b3': "\u30b4", '\u30bf': "\u30c0", '\u30c1': "\u30c2", '\u30c4': "\u30c5", '\u30c6': "\u30c7", '\u30c8': "\u30c9",
    '\u30b5': "\u30b6", '\u30b7': "\u30b8", '\u30b9': "\u30ba", '\u30bb': "\u30bc", '\u30bd': "\u30be", '\u30cf': "\u30d0", '\u30d2': "\u30d3", '\u30d5': "\u30d6", '\u30d8': "\u30d9", '\u30db': "\u30dc"
  };
  this.VKI_deadkey['~'] = { // Tilde / Stroke
    'a': "\u00e3", 'l': "\u0142", 'n': "\u00f1", 'o': "\u00f5",
    'A': "\u00c3", 'L': "\u0141", 'N': "\u00d1", 'O': "\u00d5"
  };
  this.VKI_deadkey['^'] = { // Circumflex
    'a': "\u00e2", 'e': "\u00ea", 'i': "\u00ee", 'o': "\u00f4", 'u': "\u00fb", 'w': "\u0175", 'y': "\u0177",
    'A': "\u00c2", 'E': "\u00ca", 'I': "\u00ce", 'O': "\u00d4", 'U': "\u00db", 'W': "\u0174", 'Y': "\u0176"
  };
  this.VKI_deadkey['\u02c7'] = { // Baltic caron
    'c': "\u010D", 'd': "\u010f", 'e': "\u011b", 's': "\u0161", 'l': "\u013e", 'n': "\u0148", 'r': "\u0159", 't': "\u0165", 'u': "\u01d4", 'z': "\u017E", '\u00fc': "\u01da",
    'C': "\u010C", 'D': "\u010e", 'E': "\u011a", 'S': "\u0160", 'L': "\u013d", 'N': "\u0147", 'R': "\u0158", 'T': "\u0164", 'U': "\u01d3", 'Z': "\u017D", '\u00dc': "\u01d9"
  };
  this.VKI_deadkey['\u02d8'] = { // Romanian and Turkish breve
    'a': "\u0103", 'g': "\u011f",
    'A': "\u0102", 'G': "\u011e"
  };
  this.VKI_deadkey['-'] = this.VKI_deadkey['\u00af'] = { // Macron
    'a': "\u0101", 'e': "\u0113", 'i': "\u012b", 'o': "\u014d", 'u': "\u016B", 'y': "\u0233", '\u00fc': "\u01d6",
    'A': "\u0100", 'E': "\u0112", 'I': "\u012a", 'O': "\u014c", 'U': "\u016A", 'Y': "\u0232", '\u00dc': "\u01d5"
  };
  this.VKI_deadkey['`'] = { // Grave
    'a': "\u00e0", 'e': "\u00e8", 'i': "\u00ec", 'o': "\u00f2", 'u': "\u00f9", '\u00fc': "\u01dc",
    'A': "\u00c0", 'E': "\u00c8", 'I': "\u00cc", 'O': "\u00d2", 'U': "\u00d9", '\u00dc': "\u01db", '\u0404': "\u0404\u0300", '\u0406': "\u0406\u0300", '\u0407': "\u0407\u0300", '\u0410': "\u0410\u0300", '\u0415': "\u0415\u0300", '\u0418': "\u0418\u0300", '\u041E': "\u041E\u0300", '\u0423': "\u0423\u0300", '\u042B': "\u042B\u0300", '\u042D': "\u042D\u0300", '\u042E': "\u042E\u0300", '\u042F': "\u042F\u0300", '\u0430': "\u0430\u0300", '\u0435': "\u0435\u0300", '\u0438': "\u0438\u0300", '\u043E': "\u043E\u0300", '\u0443': "\u0443\u0300", '\u044B': "\u044B\u0300", '\u044D': "\u044D\u0300", '\u044F': "\u044F\u0300", '\u0454': "\u0454\u0300", '\u0456': "\u0456\u0300", '\u0457': "\u0457\u0300", '\u0462': "\u0462\u0300", '\u0463': "\u0463\u0300", '\u0460': "\u0460\u0300", '\u0461': "\u0461\u0300", '\u0464': "\u0464\u0300", '\u0465': "\u0465\u0300", '\u0466': "\u0466\u0300", '\u0467': "\u0467\u0300", '\u0468': "\u0468\u0300", '\u0469': "\u0469\u0300", '\u046A': "\u046A\u0300", '\u046B': "\u046B\u0300", '\u046C': "\u046C\u0300", '\u046D': "\u046D\u0300", '\u0474': "\u0474\u0300", '\u0475': "\u0475\u0300", '\u0478': "\u0478\u0300", '\u0479': "\u0479\u0300", '\u047A': "\u047A\u0300", '\u047B': "\u047B\u0300", '\u047C': "\u047C\u0300", '\u047D': "\u047D\u0300", '\u047E': "\u047E\u0300", '\u047F': "\u047F\u0300", '\u044E': "\u044E\u0300", '\u042E': "\u042E\u0300", '\ua64b': "\ua64b\u0300", '\ua64a': "\ua64a\u0300", '\uA657': "\uA657\u0300", '\uA656': "\uA656\u0300", '\uA653': "\uA653\u0300", '\uA652': "\uA652\u0300", '\u0306': "\u0306\u0300", '\u0483': "\u0483\u0300", '\u0484': "\u0484\u0300", '\u0485': "\u0485\u0300", '\u0486': "\u0486\u0300", '\u02D8': "\u02D8\u0300" 
  };
  this.VKI_deadkey["'"] = this.VKI_deadkey['\u00b4'] = this.VKI_deadkey['\u0384'] = { // Acute / Greek Tonos
    'a': "\u00e1", 'e': "\u00e9", 'i': "\u00ed", 'o': "\u00f3", 'u': "\u00fa", 'y': "\u00fd", '\u03b1': "\u03ac", '\u03b5': "\u03ad", '\u03b7': "\u03ae", '\u03b9': "\u03af", '\u03bf': "\u03cc", '\u03c5': "\u03cd", '\u03c9': "\u03ce", '\u00fc': "\u01d8",
    'A': "\u00c1", 'E': "\u00c9", 'I': "\u00cd", 'O': "\u00d3", 'U': "\u00da", 'Y': "\u00dd", '\u0391': "\u0386", '\u0395': "\u0388", '\u0397': "\u0389", '\u0399': "\u038a", '\u039f': "\u038c", '\u03a5': "\u038e", '\u03a9': "\u038f", '\u00dc': "\u01d7", '\u0435': "\u0435\u0301", '\u0404': "\u0404\u0301", '\u0406': "\u0406\u0301", '\u0407': "\u0407\u0301", '\u0410': "\u0410\u0301", '\u0415': "\u0415\u0301", '\u0418': "\u0418\u0301", '\u041E': "\u041E\u0301", '\u0423': "\u0423\u0301", '\u042B': "\u042B\u0301", '\u042D': "\u042D\u0301", '\u042E': "\u042E\u0301", '\u042F': "\u042F\u0301", '\u0430': "\u0430\u0301", '\u0435': "\u0435\u0301", '\u0438': "\u0438\u0301", '\u043E': "\u043E\u0301", '\u0443': "\u0443\u0301", '\u044B': "\u044B\u0301", '\u044D': "\u044D\u0301", '\u044F': "\u044F\u0301", '\u0454': "\u0454\u0301", '\u0456': "\u0456\u0301", '\u0457': "\u0457\u0301", '\u0462': "\u0462\u0301", '\u0463': "\u0463\u0301", '\u0460': "\u0460\u0301", '\u0461': "\u0461\u0301", '\u0464': "\u0464\u0301", '\u0465': "\u0465\u0301", '\u0466': "\u0466\u0301", '\u0467': "\u0467\u0301", '\u0468': "\u0468\u0301", '\u0469': "\u0469\u0301", '\u046A': "\u046A\u0301", '\u046B': "\u046B\u0301", '\u046C': "\u046C\u0301", '\u046D': "\u046D\u0301", '\u0474': "\u0474\u0301", '\u0475': "\u0475\u0301", '\u0478': "\u0478\u0301", '\u0479': "\u0479\u0301", '\u047A': "\u047A\u0301", '\u047B': "\u047B\u0301", '\u047C': "\u047C\u0301", '\u047D': "\u047D\u0301", '\u047E': "\u047E\u0301", '\u047F': "\u047F\u0301", '\u044E': "\u044E\u0301", '\u042E': "\u042E\u0301", '\ua64b': "\ua64b\u0301", '\ua64a': "\ua64a\u0301", '\uA657': "\uA657\u0301", '\uA656': "\uA656\u0301", '\uA653': "\uA653\u0301", '\uA652': "\uA652\u0301", '\u0306': "\u0306\u0301", '\u0483': "\u0483\u0301", '\u0484': "\u0484\u0301", '\u0485': "\u0485\u0301", '\u0486': "\u0486\u0301", '\u02D8': "\u02D8\u0301"
  };
  this.VKI_deadkey['\u02dd'] = { // Hungarian Double Acute Accent
    'o': "\u0151", 'u': "\u0171",
    'O': "\u0150", 'U': "\u0170"
  };
  this.VKI_deadkey['\u0385'] = { // Greek Dialytika + Tonos
    '\u03b9': "\u0390", '\u03c5': "\u03b0"
  };
  this.VKI_deadkey['\u00b0'] = this.VKI_deadkey['\u00ba'] = { // Ring
    'a': "\u00e5", 'u': "\u016f",
    'A': "\u00c5", 'U': "\u016e"
  };
  this.VKI_deadkey['\u02DB'] = { // Ogonek
    'a': "\u0106", 'e': "\u0119", 'i': "\u012f", 'o': "\u01eb", 'u': "\u0173", 'y': "\u0177",
    'A': "\u0105", 'E': "\u0118", 'I': "\u012e", 'O': "\u01ea", 'U': "\u0172", 'Y': "\u0176"
  };
  this.VKI_deadkey['\u02D9'] = { // Dot-above
    'c': "\u010B", 'e': "\u0117", 'g': "\u0121", 'z': "\u017C",
    'C': "\u010A", 'E': "\u0116", 'G': "\u0120", 'Z': "\u017B"
  };
  this.VKI_deadkey['\u00B8'] = this.VKI_deadkey['\u201a'] = { // Cedilla
    'c': "\u00e7", 's': "\u015F",
    'C': "\u00c7", 'S': "\u015E"
  };
  this.VKI_deadkey[','] = { // Comma
    's': (this.VKI_isIElt8) ? "\u015F" : "\u0219", 't': (this.VKI_isIElt8) ? "\u0163" : "\u021B",
    'S': (this.VKI_isIElt8) ? "\u015E" : "\u0218", 'T': (this.VKI_isIElt8) ? "\u0162" : "\u021A"
  };
  this.VKI_deadkey['\u3002'] = { // Hiragana/Katakana Point
    '\u306f': "\u3071", '\u3072': "\u3074", '\u3075': "\u3077", '\u3078': "\u307a", '\u307b': "\u307d",
    '\u30cf': "\u30d1", '\u30d2': "\u30d4", '\u30d5': "\u30d7", '\u30d8': "\u30da", '\u30db': "\u30dd"
  };

  this.VKI_deadkey[' \u0487'] = { // dasy pneuma
  '\u0391': "\u0386", '\u0395': "\u0388", '\u0397': "\u0389", '\u0399': "\u038a", '\u039f': "\u038c", '\u03a5': "\u038e", '\u03a9': "\u038f", '\u00dc': "\u01d7", '\u0435': "\u0435\u0487", '\u0404': "\u0404\u0487", '\u0406': "\u0406\u0487", '\u0407': "\u0407\u0487", '\u0410': "\u0410\u0487", '\u0415': "\u0415\u0487", '\u0418': "\u0418\u0487", '\u041E': "\u041E\u0487", '\u0423': "\u0423\u0487", '\u042B': "\u042B\u0487", '\u042D': "\u042D\u0487", '\u042E': "\u042E\u0487", '\u042F': "\u042F\u0487", '\u0430': "\u0430\u0487", '\u0435': "\u0435\u0487", '\u0438': "\u0438\u0487", '\u043E': "\u043E\u0487", '\u0443': "\u0443\u0487", '\u044B': "\u044B\u0487", '\u044D': "\u044D\u0487", '\u044F': "\u044F\u0487", '\u0454': "\u0454\u0487", '\u0456': "\u0456\u0487", '\u0457': "\u0457\u0487", '\u0462': "\u0462\u0487", '\u0463': "\u0463\u0487", '\u0460': "\u0460\u0487", '\u0461': "\u0461\u0487", '\u0464': "\u0464\u0487", '\u0465': "\u0465\u0487", '\u0466': "\u0466\u0487", '\u0467': "\u0467\u0487", '\u0468': "\u0468\u0487", '\u0469': "\u0469\u0487", '\u046A': "\u046A\u0487", '\u046B': "\u046B\u0487", '\u046C': "\u046C\u0487", '\u046D': "\u046D\u0487", '\u0474': "\u0474\u0487", '\u0475': "\u0475\u0487", '\u0478': "\u0478\u0487", '\u0479': "\u0479\u0487", '\u047A': "\u047A\u0487", '\u047B': "\u047B\u0487", '\u047C': "\u047C\u0487", '\u047D': "\u047D\u0487", '\u047E': "\u047E\u0487", '\u047F': "\u047F\u0487", '\u044E': "\u044E\u0487", '\u042E': "\u042E\u0487", '\ua64b': "\ua64b\u0487", '\ua64a': "\ua64a\u0487", '\uA657': "\uA657\u0487", '\uA656': "\uA656\u0487", '\uA653': "\uA653\u0487", '\uA652': "\uA652\u0487", '\u0306': "\u0306\u0487", '\u0483': "\u0483\u0487", '\u0484': "\u0484\u0487", '\u0485': "\u0485\u0487", '\u0486': "\u0486\u0487", '\u02D8': "\u02D8\u0487"
  };

 // Ethiopic
this.VKI_deadkey['\u{1369}'] = {'1': "\u{1369}", '2': "\u{136A}", '3': "\u{136B}", '4': "\u{136C}", '5': "\u{136D}", '6': "\u{136E}", '7': "\u{136F}", '8': "\u{1370}", '9': "\u{1371}", '0': "\u{137B}"};
this.VKI_deadkey['\u{1200}'] = {'\u{12A3}': "\u{1203}", '\u{12A1}': "\u{1201}", '\u{12A0}': "\u{1200}", '\u{12A5}': "\u{1205}", '\u{12A4}': "\u{1204}", '\u{12A5}': "\u{1205}", '\u{12A0}': "\u{1200}", '\u{12A6}': "\u{1206}", '\u{12A2}': "\u{1202}"};
this.VKI_deadkey['\u{1260}'] = {'\u{12A3}': "\u{1263}",'\u{12A1}': "\u{1261}", '\u{12A0}': "\u{1260}", '\u{12A5}': "\u{1265}", '\u{12A4}': "\u{1264}", '\u{12A7}': "\u{1267}", '\u{12A5}': "\u{1265}", '\u{12A0}': "\u{1260}", '\u{12A6}': "\u{1266}", '\u{12A2}': "\u{1262}"};
this.VKI_deadkey['\u{1290}'] = {'\u{12A3}': "\u{1293}", '\u{12A1}': "\u{1291}", '\u{12A0}': "\u{1290}", '\u{12A5}': "\u{1295}", '\u{12A4}': "\u{1294}", '\u{12A7}': "\u{1297}", '\u{12A5}': "\u{1295}", '\u{12A0}': "\u{1290}", '\u{12A6}': "\u{1296}", '\u{12A2}': "\u{1292}"};
this.VKI_deadkey['\u{1218}'] = {'\u{12A3}': "\u{121B}", '\u{12A1}': "\u{1219}", '\u{12A0}': "\u{1218}", '\u{12A5}': "\u{121D}", '\u{12A4}': "\u{121C}", '\u{12A7}': "\u{121F}", '\u{12A5}': "\u{121D}", '\u{12A0}': "\u{1218}", '\u{12A6}': "\u{121E}", '\u{12A2}': "\u{121A}"};
this.VKI_deadkey['\u{12C8}'] = {'\u{12A3}': "\u{12CB}", '\u{12A1}': "\u{12C9}", '\u{12A0}': "\u{12C8}", '\u{12A5}': "\u{12CD}", '\u{12A4}': "\u{12CC}", '\u{12A5}': "\u{12CD}", '\u{12A0}': "\u{12C8}", '\u{12A6}': "\u{12CE}", '\u{12A2}': "\u{12CA}"};
this.VKI_deadkey['\u{1320}'] = {'\u{12A3}': "\u{1323}", '\u{12A1}': "\u{1321}", '\u{12A0}': "\u{1320}", '\u{12A5}': "\u{1325}", '\u{12A4}': "\u{1324}", '\u{12A7}': "\u{1327}", '\u{12A5}': "\u{1325}", '\u{12A0}': "\u{1320}", '\u{12A6}': "\u{1326}", '\u{12A2}': "\u{1322}"};
this.VKI_deadkey['\u{1270}'] = {'\u{12A3}': "\u{1273}", '\u{12A1}': "\u{1271}", '\u{12A0}': "\u{1270}", '\u{12A5}': "\u{1275}", '\u{12A4}': "\u{1274}", '\u{12A7}': "\u{1277}", '\u{12A5}': "\u{1275}", '\u{12A0}': "\u{1270}", '\u{12A6}': "\u{1276}", '\u{12A2}': "\u{1272}"};
this.VKI_deadkey['\u{1208}'] = {'\u{12A3}': "\u{120B}", '\u{12A1}': "\u{1209}", '\u{12A0}': "\u{1208}", '\u{12A5}': "\u{120D}", '\u{12A4}': "\u{120C}", '\u{12A7}': "\u{120F}", '\u{12A5}': "\u{120D}", '\u{12A0}': "\u{1208}", '\u{12A6}': "\u{120E}", '\u{12A2}': "\u{120A}"};
this.VKI_deadkey['\u{1228}'] = {'\u{12A3}': "\u{122B}", '\u{12A1}': "\u{1229}", '\u{12A0}': "\u{1228}", '\u{12A5}': "\u{122D}", '\u{12A4}': "\u{122C}", '\u{12A7}': "\u{122F}", '\u{12A5}': "\u{122D}", '\u{12A0}': "\u{1228}", '\u{12A6}': "\u{122E}", '\u{12A2}': "\u{122A}"};
this.VKI_deadkey['\u{12E8}'] = {'\u{12A3}': "\u{12EB}", '\u{12A1}': "\u{12E9}", '\u{12A0}': "\u{12E8}", '\u{12A5}': "\u{12ED}", '\u{12A4}': "\u{12EC}", '\u{12A5}': "\u{12ED}", '\u{12A0}': "\u{12E8}", '\u{12A6}': "\u{12EE}", '\u{12A2}': "\u{12EA}"};
this.VKI_deadkey['\u{1250}'] = {'\u{12A3}': "\u{1253}", '\u{12A1}': "\u{1251}", '\u{12A0}': "\u{1250}", '\u{12A5}': "\u{1255}", '\u{12A4}': "\u{1254}", '\u{12A7}': "\u{125B}", '\u{12A5}': "\u{1255}", '\u{12A0}': "\u{1250}", '\u{12A6}': "\u{1256}", '\u{12A2}': "\u{1252}"};
this.VKI_deadkey['\u{1240}'] = {'\u{12A3}': "\u{1243}", '\u{12A1}': "\u{1241}", '\u{12A0}': "\u{1240}", '\u{12A5}': "\u{1245}", '\u{12A4}': "\u{1244}", '\u{12A7}': "\u{124B}", '\u{12A5}': "\u{1245}", '\u{12A0}': "\u{1240}", '\u{12A6}': "\u{1246}", '\u{12A2}': "\u{1242}"};
this.VKI_deadkey['\u{12A8}'] = {'\u{12A3}': "\u{12AB}", '\u{12A1}': "\u{12A9}", '\u{12A0}': "\u{12A8}", '\u{12A5}': "\u{12AD}", '\u{12A4}': "\u{12AC}", '\u{12A7}': "\u{12B3}", '\u{12A5}': "\u{12AD}", '\u{12A0}': "\u{12A8}", '\u{12A6}': "\u{12AE}", '\u{12A2}': "\u{12AA}"};
this.VKI_deadkey['\u{12F0}'] = {'\u{12A3}': "\u{12F3}", '\u{12A1}': "\u{12F1}", '\u{12A0}': "\u{12F0}", '\u{12A5}': "\u{12F5}", '\u{12A4}': "\u{12F4}", '\u{12A7}': "\u{12F7}", '\u{12A5}': "\u{12F5}", '\u{12A0}': "\u{12F0}", '\u{12A6}': "\u{12F6}", '\u{12A2}': "\u{12F2}"};
this.VKI_deadkey['\u{12B8}'] = {'\u{12A3}': "\u{12BB}", '\u{12A1}': "\u{12B9}", '\u{12A0}': "\u{12B8}", '\u{12A5}': "\u{12C3}", '\u{12A4}': "\u{12BC}", '\u{12A5}': "\u{12C3}", '\u{12A0}': "\u{12B8}", '\u{12A6}': "\u{12BE}", '\u{12A2}': "\u{12BA}"};
this.VKI_deadkey['\u{1308}'] = {'\u{12A3}': "\u{130B}", '\u{12A1}': "\u{1309}", '\u{12A0}': "\u{1308}", '\u{12A5}': "\u{130D}", '\u{12A4}': "\u{130C}", '\u{12A7}': "\u{1313}", '\u{12A5}': "\u{130D}", '\u{12A0}': "\u{1308}", '\u{12A6}': "\u{130E}", '\u{12A2}': "\u{130A}"};
this.VKI_deadkey['\u{1230}'] = {'\u{12A3}': "\u{1233}", '\u{12A1}': "\u{1231}", '\u{12A0}': "\u{1230}", '\u{12A5}': "\u{1235}", '\u{12A4}': "\u{1234}", '\u{12A7}': "\u{1237}", '\u{12A5}': "\u{1235}", '\u{12A0}': "\u{1230}", '\u{12A6}': "\u{1236}", '\u{12A2}': "\u{1232}"};
this.VKI_deadkey['\u{1278}'] = {'\u{12A3}': "\u{127B}", '\u{12A1}': "\u{1279}", '\u{12A0}': "\u{1278}", '\u{12A5}': "\u{127D}", '\u{12A4}': "\u{127C}", '\u{12A7}': "\u{127F}", '\u{12A5}': "\u{127D}", '\u{12A0}': "\u{1278}", '\u{12A6}': "\u{127E}", '\u{12A2}': "\u{127A}"};
this.VKI_deadkey['\u{12D8}'] = {'\u{12A3}': "\u{12DB}", '\u{12A1}': "\u{12D9}", '\u{12A0}': "\u{12D8}", '\u{12A5}': "\u{12DD}", '\u{12A4}': "\u{12DC}", '\u{12A7}': "\u{12DF}", '\u{12A5}': "\u{12DD}", '\u{12A0}': "\u{12D8}", '\u{12A6}': "\u{12DE}", '\u{12A2}': "\u{12DA}"};
this.VKI_deadkey['\u{1348}'] = {'\u{12A3}': "\u{134B}", '\u{12A1}': "\u{1349}", '\u{12A0}': "\u{1348}", '\u{12A5}': "\u{134D}", '\u{12A4}': "\u{134C}", '\u{12A7}': "\u{134F}", '\u{12A5}': "\u{134D}", '\u{12A0}': "\u{1348}", '\u{12A6}': "\u{134E}", '\u{12A2}': "\u{134A}"};
this.VKI_deadkey['\u{1210}'] = {'\u{12A3}': "\u{1213}", '\u{12A1}': "\u{1211}", '\u{12A0}': "\u{1210}", '\u{12A5}': "\u{1215}", '\u{12A4}': "\u{1214}", '\u{12A7}': "\u{1217}", '\u{12A5}': "\u{1215}", '\u{12A0}': "\u{1210}", '\u{12A6}': "\u{1216}", '\u{12A2}': "\u{1212}",'\u{1364}': "\u{1213}", '\u{1366}': "\u{1211}", '\u{AB}': "\u{1210}", '\u{1361}': "\u{1215}", '\u{1368}': "\u{1214}", '\u{1367}': "\u{1217}", '\u{1363}': "\u{1215}", '\u{BB}': "\u{1210}", '\u{1365}': "\u{1216}", '\u{1362}': "\u{1212}"};
this.VKI_deadkey['\u{1268}'] = {'\u{12A3}': "\u{126B}", '\u{12A1}': "\u{1269}", '\u{12A0}': "\u{1268}", '\u{12A5}': "\u{126D}", '\u{12A4}': "\u{126C}", '\u{12A7}': "\u{126F}", '\u{12A5}': "\u{126D}", '\u{12A0}': "\u{1268}", '\u{12A6}': "\u{126E}", '\u{12A2}': "\u{126A}", '\u{1364}': "\u{126B}", '\u{1366}': "\u{1269}", '\u{AB}': "\u{1268}", '\u{1361}': "\u{126D}", '\u{1368}': "\u{126C}", '\u{1367}': "\u{126F}", '\u{1363}': "\u{126D}", '\u{BB}': "\u{1268}", '\u{1365}': "\u{126E}", '\u{1362}': "\u{126A}"};
this.VKI_deadkey['\u{1298}'] = {'\u{12A3}': "\u{129B}", '\u{12A1}': "\u{1299}", '\u{12A0}': "\u{1298}", '\u{12A5}': "\u{129D}", '\u{12A4}': "\u{129C}", '\u{12A7}': "\u{129F}", '\u{12A5}': "\u{129D}", '\u{12A0}': "\u{1298}", '\u{12A6}': "\u{129E}", '\u{12A2}': "\u{129A}", '\u{1364}': "\u{129B}", '\u{1366}': "\u{1299}", '\u{AB}': "\u{1298}", '\u{1361}': "\u{129D}", '\u{1368}': "\u{129C}", '\u{1367}': "\u{129F}", '\u{1363}': "\u{129D}", '\u{BB}': "\u{1298}", '\u{1365}': "\u{129E}", '\u{1362}': "\u{129A}"};
this.VKI_deadkey['\u{1238}'] = {'\u{12A3}': "\u{123B}", '\u{12A1}': "\u{1239}", '\u{12A0}': "\u{1238}", '\u{12A5}': "\u{123D}", '\u{12A4}': "\u{123C}", '\u{12A7}': "\u{123F}", '\u{12A5}': "\u{123D}", '\u{12A0}': "\u{1238}", '\u{12A6}': "\u{123E}", '\u{12A2}': "\u{123A}", '\u{1364}': "\u{123B}", '\u{1366}': "\u{1239}", '\u{AB}': "\u{1238}", '\u{1361}': "\u{123D}", '\u{1368}': "\u{123C}", '\u{1367}': "\u{123F}", '\u{1363}': "\u{123D}", '\u{BB}': "\u{1238}", '\u{1365}': "\u{123E}", '\u{1362}': "\u{123A}"};
this.VKI_deadkey['\u{12D0}'] = {'\u{12A3}': "\u{12D3}", '\u{12A1}': "\u{12D1}", '\u{12A0}': "\u{12D0}", '\u{12A5}': "\u{12D5}", '\u{12A4}': "\u{12D4}", '\u{12A5}': "\u{12D5}", '\u{12A0}': "\u{12D0}", '\u{12A6}': "\u{12D6}", '\u{12A2}': "\u{12D2}", '\u{1364}': "\u{12D3}", '\u{1366}': "\u{12D1}", '\u{AB}': "\u{12D0}", '\u{1361}': "\u{12D5}", '\u{1368}': "\u{12D4}", '\u{1363}': "\u{12D5}", '\u{BB}': "\u{12D0}", '\u{1365}': "\u{12D6}", '\u{1362}': "\u{12D2}"};
this.VKI_deadkey['\u{1328}'] = {'\u{12A3}': "\u{132B}", '\u{12A1}': "\u{1329}", '\u{12A0}': "\u{1328}", '\u{12A5}': "\u{132D}", '\u{12A4}': "\u{132C}", '\u{12A7}': "\u{132F}", '\u{12A5}': "\u{132D}", '\u{12A0}': "\u{1328}", '\u{12A6}': "\u{132E}", '\u{12A2}': "\u{132A}", '\u{1364}': "\u{132B}", '\u{1366}': "\u{1329}", '\u{AB}': "\u{1328}", '\u{1361}': "\u{132D}", '\u{1368}': "\u{132C}", '\u{1367}': "\u{132F}", '\u{1363}': "\u{132D}", '\u{BB}': "\u{1328}", '\u{1365}': "\u{132E}", '\u{1362}': "\u{132A}"};
this.VKI_deadkey['\u{1340}'] = {'\u{12A3}': "\u{1343}", '\u{12A1}': "\u{1341}", '\u{12A0}': "\u{1340}", '\u{12A5}': "\u{1345}", '\u{12A4}': "\u{1344}", '\u{12A5}': "\u{1345}", '\u{12A0}': "\u{1340}", '\u{12A6}': "\u{1346}", '\u{12A2}': "\u{1342}", '\u{1364}': "\u{1343}", '\u{1366}': "\u{1341}",'\u{AB}': "\u{1340}", '\u{1361}': "\u{1345}", '\u{1368}': "\u{1344}", '\u{1363}': "\u{1345}", '\u{BB}': "\u{1340}", '\u{1365}': "\u{1346}", '\u{1362}': "\u{1342}"};
this.VKI_deadkey['\u{1338}'] = {'\u{12A3}': "\u{133A}", '\u{12A1}': "\u{1339}", '\u{12A0}': "\u{1338}", '\u{12A5}': "\u{133D}", '\u{12A4}': "\u{133C}", '\u{12A7}': "\u{133F}", '\u{12A5}': "\u{133D}", '\u{12A0}': "\u{1338}", '\u{12A6}': "\u{133E}", '\u{12A2}': "\u{133A}", '\u{1364}': "\u{133A}", '\u{1366}': "\u{1339}", '\u{AB}': "\u{1338}", '\u{1361}': "\u{133D}", '\u{1368}': "\u{133C}", '\u{1367}': "\u{133F}", '\u{1363}': "\u{133D}", '\u{BB}': "\u{1338}", '\u{1365}': "\u{133E}", '\u{1362}': "\u{133A}"};
this.VKI_deadkey['\u{1280}'] = {'\u{12A3}': "\u{1283}", '\u{12A1}': "\u{1281}", '\u{12A0}': "\u{1280}", '\u{12A5}': "\u{1285}", '\u{12A4}': "\u{1284}", '\u{12A7}': "\u{128B}", '\u{12A5}': "\u{1285}", '\u{12A0}': "\u{1280}", '\u{12A6}': "\u{1286}", '\u{12A2}': "\u{128A}", '\u{1364}': "\u{1283}", '\u{1366}': "\u{1281}", '\u{AB}': "\u{1280}", '\u{1361}': "\u{1285}", '\u{1368}': "\u{1284}", '\u{1367}': "\u{128B}", '\u{1363}': "\u{1285}", '\u{BB}': "\u{1280}", '\u{1365}': "\u{1286}", '\u{1362}': "\u{128A}"};
this.VKI_deadkey['\u{1288}'] = {'\u{12A3}': "\u{128B}", '\u{12A0}': "\u{1288}", '\u{12A5}': "\u{128D}", '\u{12A4}': "\u{128C}", '\u{12A5}': "\u{128D}", '\u{12A0}': "\u{1288}", '\u{12A2}': "\u{128A}", '\u{1364}': "\u{128B}", '\u{AB}': "\u{1288}", '\u{1361}': "\u{128D}", '\u{1368}': "\u{128C}", '\u{1363}': "\u{128D}", '\u{BB}': "\u{1288}", '\u{1362}': "\u{128A}"};
this.VKI_deadkey['\u{1258}'] = {'\u{12A3}': "\u{125B}", '\u{12A0}': "\u{1258}", '\u{12A5}': "\u{125D}", '\u{12A4}': "\u{125C}", '\u{12A5}': "\u{125D}", '\u{12A0}': "\u{1258}", '\u{12A2}': "\u{125A}", '\u{1364}': "\u{125B}", '\u{AB}': "\u{1258}", '\u{1361}': "\u{125D}", '\u{1368}': "\u{125C}", '\u{1363}': "\u{125D}", '\u{BB}': "\u{1258}", '\u{1362}': "\u{125A}"};
this.VKI_deadkey['\u{1248}'] = {'\u{12A3}': "\u{124B}", '\u{12A0}': "\u{1248}", '\u{12A5}': "\u{124D}", '\u{12A4}': "\u{124C}", '\u{12A5}': "\u{124D}", '\u{12A0}': "\u{1248}", '\u{12A2}': "\u{124A}", '\u{1364}': "\u{124B}", '\u{AB}': "\u{1248}", '\u{1361}': "\u{124D}", '\u{1368}': "\u{124C}", '\u{1363}': "\u{124D}", '\u{BB}': "\u{1248}", '\u{1362}': "\u{124A}"};
this.VKI_deadkey['\u{12B0}'] = {'\u{12A3}': "\u{12B3}", '\u{12A0}': "\u{12B0}", '\u{12A5}': "\u{12B5}", '\u{12A4}': "\u{12B4}", '\u{12A5}': "\u{12B5}", '\u{12A0}': "\u{12B0}", '\u{12A2}': "\u{12B2}", '\u{1364}': "\u{12B3}", '\u{AB}': "\u{12B0}", '\u{1361}': "\u{12B5}", '\u{1368}': "\u{12B4}", '\u{1363}': "\u{12B5}", '\u{BB}': "\u{12B0}", '\u{1362}': "\u{12B2}"};
this.VKI_deadkey['\u{1300}'] = {'\u{12A3}': "\u{1303}", '\u{12A1}': "\u{1301}", '\u{12A0}': "\u{1300}", '\u{12A5}': "\u{1305}", '\u{12A4}': "\u{1304}", '\u{12A7}': "\u{1307}", '\u{12A5}': "\u{1305}", '\u{12A0}': "\u{1300}", '\u{12A6}': "\u{1306}", '\u{12A2}': "\u{1302}", '\u{1364}': "\u{1303}", '\u{1366}': "\u{1301}", '\u{AB}': "\u{1300}", '\u{1361}': "\u{1305}", '\u{1368}': "\u{1304}", '\u{1367}': "\u{1307}", '\u{1363}': "\u{1305}", '\u{BB}': "\u{1300}", '\u{1365}': "\u{1306}", '\u{1362}': "\u{1302}"};
this.VKI_deadkey['\u{12C0}'] = {'\u{12A3}': "\u{12C3}", '\u{12A0}': "\u{12C0}", '\u{12A5}': "\u{12C5}", '\u{12A4}': "\u{12C4}", '\u{12A5}': "\u{12C5}", '\u{12A0}': "\u{12C0}", '\u{12A2}': "\u{12C2}", '\u{1364}': "\u{12C3}", '\u{AB}': "\u{12C0}", '\u{1361}': "\u{12C5}", '\u{1368}': "\u{12C4}", '\u{1363}': "\u{12C5}", '\u{BB}': "\u{12C0}", '\u{1362}': "\u{12C2}"};
this.VKI_deadkey['\u{1310}'] = {'\u{12A3}': "\u{1313}", '\u{12A0}': "\u{1310}", '\u{12A5}': "\u{1315}", '\u{12A4}': "\u{1314}", '\u{12A5}': "\u{1315}", '\u{12A0}': "\u{1310}", '\u{12A2}': "\u{1312}", '\u{1364}': "\u{1313}", '\u{AB}': "\u{1310}", '\u{1361}': "\u{1315}", '\u{1368}': "\u{1314}", '\u{1363}': "\u{1315}", '\u{BB}': "\u{1310}", '\u{1362}': "\u{1312}"};
this.VKI_deadkey['\u{1220}'] = {'\u{12A3}': "\u{1223}", '\u{12A1}': "\u{1221}", '\u{12A0}': "\u{1220}", '\u{12A5}': "\u{1225}", '\u{12A4}': "\u{1224}", '\u{12A7}': "\u{1227}", '\u{12A5}': "\u{1225}", '\u{12A0}': "\u{1220}", '\u{12A6}': "\u{1226}", '\u{12A2}': "\u{1222}", '\u{1364}': "\u{1223}", '\u{1366}': "\u{1221}", '\u{AB}': "\u{1220}", '\u{1361}': "\u{1225}", '\u{1368}': "\u{1224}", '\u{1367}': "\u{1227}", '\u{1363}': "\u{1225}", '\u{BB}': "\u{1220}", '\u{1365}': "\u{1226}", '\u{1362}': "\u{1222}"};
this.VKI_deadkey['\u{1330}'] = {'\u{12A3}': "\u{1333}", '\u{12A1}': "\u{1331}", '\u{12A0}': "\u{1330}", '\u{12A5}': "\u{1335}", '\u{12A4}': "\u{1334}", '\u{12A7}': "\u{1337}", '\u{12A5}': "\u{1335}", '\u{12A0}': "\u{1330}", '\u{12A6}': "\u{1336}", '\u{12A2}': "\u{1332}", '\u{1364}': "", '\u{1366}': "\u{1331}", '\u{AB}': "\u{1330}", '\u{1361}': "\u{1335}", '\u{1368}': "\u{1334}", '\u{1367}': "\u{1337}", '\u{1363}': "\u{1335}", '\u{BB}': "\u{1330}", '\u{1365}': "\u{1336}", '\u{1362}': "\u{1332}"};
this.VKI_deadkey['\u{12E0}'] = {'\u{12A3}': "\u{12E3}", '\u{12A1}': "\u{12E1}", '\u{12A0}': "\u{12E0}", '\u{12A5}': "\u{12E5}", '\u{12A4}': "\u{12E4}", '\u{12A7}': "\u{12E7}", '\u{12A5}': "\u{12E5}", '\u{12A0}': "\u{12E0}", '\u{12A6}': "\u{12E6}", '\u{12A2}': "\u{12E2}", '\u{1364}': "\u{12E3}", '\u{1366}': "\u{12E1}", '\u{AB}': "\u{12E0}", '\u{1361}': "\u{12E5}", '\u{1368}': "\u{12E4}", '\u{1367}': "\u{12E7}", '\u{1363}': "\u{12E5}", '\u{BB}': "\u{12E0}", '\u{1365}': "\u{12E6}", '\u{1362}': "\u{12E2}"};
this.VKI_deadkey['\u{1350}'] = {'\u{12A3}': "\u{1353}", '\u{12A1}': "\u{1351}", '\u{12A0}': "\u{1350}", '\u{12A5}': "\u{1350}", '\u{12A4}': "\u{1354}", '\u{12A7}': "\u{1357}", '\u{12A5}': "\u{1355}", '\u{12A0}': "\u{1350}", '\u{12A6}': "\u{1356}", '\u{12A2}': "\u{1352}", '\u{1364}': "\u{1353}", '\u{1366}': "\u{1351}", '\u{AB}': "\u{1350}", '\u{1361}': "\u{1350}", '\u{1368}': "\u{1354}", '\u{1367}': "\u{1357}", '\u{1363}': "\u{1355}", '\u{BB}': "\u{1350}", '\u{1365}': "\u{1356}", '\u{1362}': "\u{1352}"};
  /* ***** Define Symbols **************************************** */
  this.VKI_symbol = {
    '\u00a0': "NB\nSP", '\u200b': "ZW\nSP", '\u200c': "ZW\nNJ", '\u200d': "ZW\nJ"
  };


  /* ***** Layout Number Pad ************************************* */
  this.VKI_numpad = [
    [["$"], ["\u00a3"], ["\u20ac"], ["\u00a5"]],
    [["7"], ["8"], ["9"], ["/"]],
    [["4"], ["5"], ["6"], ["*"]],
    [["1"], ["2"], ["3"], ["-"]],
    [["0"], ["."], ["="], ["+"]]
  ];

  /* ****************************************************************
   * Attach the keyboard to an element
   *
   */
  this.VKI_attachKeyboard = VKI_attach = function(elem) {
    if (elem.getAttribute("VKI_attached")) return false;
    if (this.VKI_imageURI) {
      var keybut = document.createElement('img');
          keybut.src = this.VKI_imageURI;
          keybut.alt = this.VKI_i18n['00'];
          keybut.className = "keyboardInputInitiator";
          keybut.title = this.VKI_i18n['01'];
          keybut.elem = elem;
          keybut.onclick = function(e) {
            e = e || event;
            if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
            self.VKI_show(this.elem);
          };
      elem.parentNode.insertBefore(keybut, (elem.dir == "rtl") ? elem : elem.nextSibling);
    } else elem.onfocus = function() { if (self.VKI_target != this) self.VKI_show(this); };
    elem.setAttribute("VKI_attached", 'true');
    if (this.VKI_isIE) {
      elem.onclick = elem.onselect = elem.onkeyup = function(e) {
        if ((e || event).type != "keyup" || !this.readOnly)
          this.range = document.selection.createRange();
      };
    }
    VKI_addListener(elem, 'click', function(e) {
      if (self.VKI_target == this) {
        e = e || event;
        if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
      } return false;
    }, false);
  };


  /* ***** Find tagged input & textarea elements ***************** */
  var inputElems = [
    document.getElementsByTagName('input'),
    document.getElementsByTagName('textarea')
  ];
  for (var x = 0, elem; elem = inputElems[x++];)
    for (var y = 0, ex; ex = elem[y++];)
      if ((ex.nodeName == "TEXTAREA" || ex.type == "text" || ex.type == "password") && ex.className.indexOf("keyboardInput") > -1)
        this.VKI_attachKeyboard(ex);

  VKI_addListener(document.documentElement, 'click', function(e) { self.VKI_close(); }, false);


  /* ****************************************************************
   * Common mouse event actions
   *
   */
  function VKI_mouseEvents(elem) {
    if (elem.nodeName == "TD") {
      if (!elem.click) elem.click = function() {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
      };
      elem.VKI_clickless = 0;
      VKI_addListener(elem, 'dblclick', function() { return false; }, false);
    }
    VKI_addListener(elem, 'mouseover', function() {
      if (this.nodeName == "TD" && self.VKI_clickless) {
        var _self = this;
        clearTimeout(this.VKI_clickless);
        this.VKI_clickless = setTimeout(function() { _self.click(); }, self.VKI_clickless);
      }
      if (self.VKI_isIE) this.className += " hover";
    }, false);
    VKI_addListener(elem, 'mouseout', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?(hover|pressed) ?/g, "");
    }, false);
    VKI_addListener(elem, 'mousedown', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className += " pressed";
    }, false);
    VKI_addListener(elem, 'mouseup', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?pressed ?/g, "");
    }, false);
  }


  /* ***** Build the keyboard interface ************************** */
  this.VKI_keyboard = document.createElement('table');
  this.VKI_keyboard.id = "keyboardInputMaster";
  this.VKI_keyboard.dir = "ltr";
  this.VKI_keyboard.cellSpacing = "0";
  this.VKI_keyboard.reflow = function() {
    this.style.width = "50px";
    var foo = this.offsetWidth;
    this.style.width = "";
  };
  VKI_addListener(this.VKI_keyboard, 'click', function(e) {
    e = e || event;
    if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
    return false;
  }, false);

  if (!this.VKI_layout[this.VKI_kt])
    return alert('No keyboard named "' + this.VKI_kt + '"');

  var thead = document.createElement('thead');
    var tr = document.createElement('tr');
      var th = document.createElement('th');
          th.colSpan = "2";

        var kbSelect = document.createElement('div');
            kbSelect.title = this.VKI_i18n['02'];
          VKI_addListener(kbSelect, 'click', function() {
            var ol = this.getElementsByTagName('ol')[0];
            if (!ol.style.display) {
                ol.style.display = "block";
              var li = ol.getElementsByTagName('li');
              for (var x = 0, scr = 0; x < li.length; x++) {
                if (VKI_kt == li[x].firstChild.nodeValue) {
                  li[x].className = "selected";
                  scr = li[x].offsetTop - li[x].offsetHeight * 2;
                } else li[x].className = "";
              } setTimeout(function() { ol.scrollTop = scr; }, 0);
            } else ol.style.display = "";
          }, false);
            kbSelect.appendChild(document.createTextNode(this.VKI_kt));
            kbSelect.appendChild(document.createTextNode(this.VKI_isIE6 ? " \u2193" : " \u25be"));
          var ol = document.createElement('ol');
            for (ktype in this.VKI_layout) {
              if (typeof this.VKI_layout[ktype] == "object") {
                if (!this.VKI_layout[ktype].lang) this.VKI_layout[ktype].lang = [];
                var li = document.createElement('li');
                    li.title = this.VKI_layout[ktype].name;
                  VKI_addListener(li, 'click', function(e) {
                    e = e || event;
                    if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
                    this.parentNode.style.display = "";
                    self.VKI_kts = self.VKI_kt = kbSelect.firstChild.nodeValue = this.firstChild.nodeValue;
                    self.VKI_buildKeys();
                    self.VKI_position(true);
                  }, false);
                  VKI_mouseEvents(li);
                    li.appendChild(document.createTextNode(ktype));
                  ol.appendChild(li);
              }
            } kbSelect.appendChild(ol);
          th.appendChild(kbSelect);

        if (this.VKI_numberPad) {
          var span = document.createElement('span');
              span.appendChild(document.createTextNode("#"));
              span.title = this.VKI_i18n['00'];
            VKI_addListener(span, 'click', function() {
              kbNumpad.style.display = (!kbNumpad.style.display) ? "none" : "";
              self.VKI_position(true);
            }, false);
            VKI_mouseEvents(span);
            th.appendChild(span);
        }

        this.VKI_kbsize = function(e) {
          self.VKI_size = Math.min(5, Math.max(1, self.VKI_size));
          self.VKI_keyboard.className = self.VKI_keyboard.className.replace(/ ?keyboardInputSize\d ?/, "");
          if (self.VKI_size != 2) self.VKI_keyboard.className += " keyboardInputSize" + self.VKI_size;
          self.VKI_position(true);
          if (self.VKI_isOpera) self.VKI_keyboard.reflow();
        };
        if (this.VKI_sizeAdj) {
          var small = document.createElement('small');
              small.title = this.VKI_i18n['10'];
            VKI_addListener(small, 'click', function() {
              --self.VKI_size;
              self.VKI_kbsize();
            }, false);
            VKI_mouseEvents(small);
              small.appendChild(document.createTextNode(this.VKI_isIE6 ? "\u2193" : "\u21d3"));
            th.appendChild(small);
          var big = document.createElement('big');
              big.title = this.VKI_i18n['11'];
            VKI_addListener(big, 'click', function() {
              ++self.VKI_size;
              self.VKI_kbsize();
            }, false);
            VKI_mouseEvents(big);
              big.appendChild(document.createTextNode(this.VKI_isIE6 ? "\u2191" : "\u21d1"));
            th.appendChild(big);
        }

        var span = document.createElement('span');
            span.appendChild(document.createTextNode(this.VKI_i18n['07']));
            span.title = this.VKI_i18n['08'];
          VKI_addListener(span, 'click', function() {
            self.VKI_target.value = "";
            self.VKI_target.focus();
            return false;
          }, false);
          VKI_mouseEvents(span);
          th.appendChild(span);

        var strong = document.createElement('strong');
            strong.appendChild(document.createTextNode('X'));
            strong.title = this.VKI_i18n['06'];
          VKI_addListener(strong, 'click', function() { self.VKI_close(); }, false);
          VKI_mouseEvents(strong);
          th.appendChild(strong);

        tr.appendChild(th);
      thead.appendChild(tr);
  this.VKI_keyboard.appendChild(thead);

  var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
      var td = document.createElement('td');
        var div = document.createElement('div');

        if (this.VKI_deadBox) {
          var label = document.createElement('label');
            var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.title = this.VKI_i18n['03'] + ": " + ((this.VKI_deadkeysOn) ? this.VKI_i18n['04'] : this.VKI_i18n['05']);
                checkbox.defaultChecked = this.VKI_deadkeysOn;
              VKI_addListener(checkbox, 'click', function() {
                this.title = self.VKI_i18n['03'] + ": " + ((this.checked) ? self.VKI_i18n['04'] : self.VKI_i18n['05']);
                self.VKI_modify("");
                return true;
              }, false);
              label.appendChild(checkbox);
                checkbox.checked = this.VKI_deadkeysOn;
            div.appendChild(label);
          this.VKI_deadkeysOn = checkbox;
        } else this.VKI_deadkeysOn.checked = this.VKI_deadkeysOn;

        if (this.VKI_showVersion) {
          var vr = document.createElement('var');
              vr.title = this.VKI_i18n['09'] + " " + this.VKI_version;
              vr.appendChild(document.createTextNode("v" + this.VKI_version));
            div.appendChild(vr);
        } td.appendChild(div);
        tr.appendChild(td);

      var kbNumpad = document.createElement('td');
          kbNumpad.id = "keyboardInputNumpad";
        if (!this.VKI_numberPadOn) kbNumpad.style.display = "none";
        var ntable = document.createElement('table');
            ntable.cellSpacing = "0";
          var ntbody = document.createElement('tbody');
            for (var x = 0; x < this.VKI_numpad.length; x++) {
              var ntr = document.createElement('tr');
                for (var y = 0; y < this.VKI_numpad[x].length; y++) {
                  var ntd = document.createElement('td');
                    VKI_addListener(ntd, 'click', VKI_keyClick, false);
                    VKI_mouseEvents(ntd);
                      ntd.appendChild(document.createTextNode(this.VKI_numpad[x][y]));
                    ntr.appendChild(ntd);
                } ntbody.appendChild(ntr);
            } ntable.appendChild(ntbody);
          kbNumpad.appendChild(ntable);
        tr.appendChild(kbNumpad);
      tbody.appendChild(tr);
  this.VKI_keyboard.appendChild(tbody);

  if (this.VKI_isIE6) {
    this.VKI_iframe = document.createElement('iframe');
    this.VKI_iframe.style.position = "absolute";
    this.VKI_iframe.style.border = "0px none";
    this.VKI_iframe.style.filter = "mask()";
    this.VKI_iframe.style.zIndex = "999999";
    this.VKI_iframe.src = this.VKI_imageURI;
  }


  /* ****************************************************************
   * Private table cell attachment function for generic characters
   *
   */
  function VKI_keyClick() {
    var done = false, character = "\xa0";
    if (this.firstChild.nodeName.toLowerCase() != "small") {
      if ((character = this.firstChild.nodeValue) == "\xa0") return false;
    } else character = this.firstChild.getAttribute('char');
    if (self.VKI_deadkeysOn.checked && self.VKI_dead) {
      if (self.VKI_dead != character) {
        if (character != " ") {
          if (self.VKI_deadkey[self.VKI_dead][character]) {
            self.VKI_insert(self.VKI_deadkey[self.VKI_dead][character]);
            done = true;
          }
        } else {
          self.VKI_insert(self.VKI_dead);
          done = true;
        }
      } else done = true;
    } self.VKI_dead = false;

    if (!done) {
      if (self.VKI_deadkeysOn.checked && self.VKI_deadkey[character]) {
        self.VKI_dead = character;
        this.className += " dead";
        if (self.VKI_shift) self.VKI_modify("Shift");
        if (self.VKI_altgr) self.VKI_modify("AltGr");
      } else self.VKI_insert(character);
    } self.VKI_modify("");
    return false;
  }


  /* ****************************************************************
   * Build or rebuild the keyboard keys
   *
   */
  this.VKI_buildKeys = function() {
    this.VKI_shift = this.VKI_shiftlock = this.VKI_altgr = this.VKI_altgrlock = this.VKI_dead = false;
    var container = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0];
    var tables = container.getElementsByTagName('table');
    for (var x = tables.length - 1; x >= 0; x--) container.removeChild(tables[x]);

    for (var x = 0, hasDeadKey = false, lyt; lyt = this.VKI_layout[this.VKI_kt].keys[x++];) {
      var table = document.createElement('table');
          table.cellSpacing = "0";
        if (lyt.length <= this.VKI_keyCenter) table.className = "keyboardInputCenter";
        var tbody = document.createElement('tbody');
          var tr = document.createElement('tr');
            for (var y = 0, lkey; lkey = lyt[y++];) {
              var td = document.createElement('td');
                if (this.VKI_symbol[lkey[0]]) {
                  var text = this.VKI_symbol[lkey[0]].split("\n");
                  var small = document.createElement('small');
                      small.setAttribute('char', lkey[0]);
                  for (var z = 0; z < text.length; z++) {
                    if (z) small.appendChild(document.createElement("br"));
                    small.appendChild(document.createTextNode(text[z]));
                  } td.appendChild(small);
                } else td.appendChild(document.createTextNode(lkey[0] || "\xa0"));

                var className = [];
                if (this.VKI_deadkeysOn.checked)
                  for (key in this.VKI_deadkey)
                    if (key === lkey[0]) { className.push("deadkey"); break; }
                if (lyt.length > this.VKI_keyCenter && y == lyt.length) className.push("last");
                if (lkey[0] == " " || lkey[1] == " ") className.push("space");
                  td.className = className.join(" ");

                switch (lkey[1]) {
                  case "Caps": case "Shift":
                  case "Alt": case "AltGr": case "AltLk":
                    VKI_addListener(td, 'click', (function(type) { return function() { self.VKI_modify(type); return false; }})(lkey[1]), false);
                    break;
                  case "Tab":
                    VKI_addListener(td, 'click', function() { self.VKI_insert("\t"); return false; }, false);
                    break;
                  case "Bksp":
                    VKI_addListener(td, 'click', function() {
                      self.VKI_target.focus();
                      if (self.VKI_target.setSelectionRange && !self.VKI_target.readOnly) {
                        var rng = [self.VKI_target.selectionStart, self.VKI_target.selectionEnd];
                        if (rng[0] < rng[1]) rng[0]++;
                        self.VKI_target.value = self.VKI_target.value.substr(0, rng[0] - 1) + self.VKI_target.value.substr(rng[1]);
                        self.VKI_target.setSelectionRange(rng[0] - 1, rng[0] - 1);
                      } else if (self.VKI_target.createTextRange && !self.VKI_target.readOnly) {
                        try {
                          self.VKI_target.range.select();
                        } catch(e) { self.VKI_target.range = document.selection.createRange(); }
                        if (!self.VKI_target.range.text.length) self.VKI_target.range.moveStart('character', -1);
                        self.VKI_target.range.text = "";
                      } else self.VKI_target.value = self.VKI_target.value.substr(0, self.VKI_target.value.length - 1);
                      if (self.VKI_shift) self.VKI_modify("Shift");
                      if (self.VKI_altgr) self.VKI_modify("AltGr");
                      self.VKI_target.focus();
                      return true;
                    }, false);
                    break;
                  case "Enter":
                    VKI_addListener(td, 'click', function() {
                      if (self.VKI_target.nodeName != "TEXTAREA") {
                        if (self.VKI_target.form) {
                          for (var z = 0, subm = false; z < self.VKI_target.form.elements.length; z++)
                            if (self.VKI_target.form.elements[z].type == "submit") subm = true;
                          if (!subm) self.VKI_target.form.submit();
                        }
                        self.VKI_close();
                      } else self.VKI_insert("\n");
                      return true;
                    }, false);
                    break;
                  default:
                    VKI_addListener(td, 'click', VKI_keyClick, false);

                } VKI_mouseEvents(td);
                tr.appendChild(td);
              for (var z = 0; z < 4; z++)
                if (this.VKI_deadkey[lkey[z] = lkey[z] || ""]) hasDeadKey = true;
            } tbody.appendChild(tr);
          table.appendChild(tbody);
        container.appendChild(table);
    }
    if (this.VKI_deadBox)
      this.VKI_deadkeysOn.style.display = (hasDeadKey) ? "inline" : "none";
    if (this.VKI_isIE6) {
      this.VKI_iframe.style.width = this.VKI_keyboard.offsetWidth + "px";
      this.VKI_iframe.style.height = this.VKI_keyboard.offsetHeight + "px";
    }
  };

  this.VKI_buildKeys();
  VKI_addListener(this.VKI_keyboard, 'selectstart', function() { return false; }, false);
  this.VKI_keyboard.unselectable = "on";
  if (this.VKI_isOpera)
    VKI_addListener(this.VKI_keyboard, 'mousedown', function() { return false; }, false);


  /* ****************************************************************
   * Controls modifier keys
   *
   */
  this.VKI_modify = function(type) {
    switch (type) {
      case "Alt":
      case "AltGr": this.VKI_altgr = !this.VKI_altgr; break;
      case "AltLk": this.VKI_altgr = 0; this.VKI_altgrlock = !this.VKI_altgrlock; break;
      case "Caps": this.VKI_shift = 0; this.VKI_shiftlock = !this.VKI_shiftlock; break;
      case "Shift": this.VKI_shift = !this.VKI_shift; break;
    } var vchar = 0;
    if (!this.VKI_shift != !this.VKI_shiftlock) vchar += 1;
    if (!this.VKI_altgr != !this.VKI_altgrlock) vchar += 2;

    var tables = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0].getElementsByTagName('table');
    for (var x = 0; x < tables.length; x++) {
      var tds = tables[x].getElementsByTagName('td');
      for (var y = 0; y < tds.length; y++) {
        var className = [], lkey = this.VKI_layout[this.VKI_kt].keys[x][y];

        switch (lkey[1]) {
          case "Alt":
          case "AltGr":
            if (this.VKI_altgr) className.push("pressed");
            break;
          case "AltLk":
            if (this.VKI_altgrlock) className.push("pressed");
            break;
          case "Shift":
            if (this.VKI_shift) className.push("pressed");
            break;
          case "Caps":
            if (this.VKI_shiftlock) className.push("pressed");
            break;
          case "Tab": case "Enter": case "Bksp": break;
          default:
            if (type) {
              tds[y].removeChild(tds[y].firstChild);
              if (this.VKI_symbol[lkey[vchar]]) {
                var text = this.VKI_symbol[lkey[vchar]].split("\n");
                var small = document.createElement('small');
                    small.setAttribute('char', lkey[vchar]);
                for (var z = 0; z < text.length; z++) {
                  if (z) small.appendChild(document.createElement("br"));
                  small.appendChild(document.createTextNode(text[z]));
                } tds[y].appendChild(small);
              } else tds[y].appendChild(document.createTextNode(lkey[vchar] || "\xa0"));
            }
            if (this.VKI_deadkeysOn.checked) {
              var character = tds[y].firstChild.nodeValue || tds[y].firstChild.className;
              if (this.VKI_dead) {
                if (character == this.VKI_dead) className.push("pressed");
                if (this.VKI_deadkey[this.VKI_dead][character]) className.push("target");
              }
              if (this.VKI_deadkey[character]) className.push("deadkey");
            }
        }

        if (y == tds.length - 1 && tds.length > this.VKI_keyCenter) className.push("last");
        if (lkey[0] == " " || lkey[1] == " ") className.push("space");
        tds[y].className = className.join(" ");
      }
    }
  };


  /* ****************************************************************
   * Insert text at the cursor
   *
   */
  this.VKI_insert = function(text) {
    this.VKI_target.focus();
    if (this.VKI_target.maxLength) this.VKI_target.maxlength = this.VKI_target.maxLength;
    if (typeof this.VKI_target.maxlength == "undefined" ||
        this.VKI_target.maxlength < 0 ||
        this.VKI_target.value.length < this.VKI_target.maxlength) {
      if (this.VKI_target.setSelectionRange && !this.VKI_target.readOnly) {
        var rng = [this.VKI_target.selectionStart, this.VKI_target.selectionEnd];
        this.VKI_target.value = this.VKI_target.value.substr(0, rng[0]) + text + this.VKI_target.value.substr(rng[1]);
        if (text == "\n" && this.VKI_isOpera) rng[0]++;
        this.VKI_target.setSelectionRange(rng[0] + text.length, rng[0] + text.length);
      } else if (this.VKI_target.createTextRange && !this.VKI_target.readOnly) {
        try {
          this.VKI_target.range.select();
        } catch(e) { this.VKI_target.range = document.selection.createRange(); }
        this.VKI_target.range.text = text;
        this.VKI_target.range.collapse(true);
        this.VKI_target.range.select();
      } else this.VKI_target.value += text;
      if (this.VKI_shift) this.VKI_modify("Shift");
      if (this.VKI_altgr) this.VKI_modify("AltGr");
      this.VKI_target.focus();
    } else if (this.VKI_target.createTextRange && this.VKI_target.range)
      this.VKI_target.range.select();
  };


  /* ****************************************************************
   * Show the keyboard interface
   *
   */
  this.VKI_show = function(elem) {
    if (!this.VKI_target) {
      this.VKI_target = elem;
      if (this.VKI_langAdapt && this.VKI_target.lang) {
        var chg = false, sub = [];
        for (ktype in this.VKI_layout) {
          if (typeof this.VKI_layout[ktype] == "object") {
            for (var x = 0; x < this.VKI_layout[ktype].lang.length; x++) {
              if (this.VKI_layout[ktype].lang[x].toLowerCase() == this.VKI_target.lang.toLowerCase()) {
                chg = kbSelect.firstChild.nodeValue = this.VKI_kt = ktype;
                break;
              } else if (this.VKI_layout[ktype].lang[x].toLowerCase().indexOf(this.VKI_target.lang.toLowerCase()) == 0)
                sub.push([this.VKI_layout[ktype].lang[x], ktype]);
            }
          } if (chg) break;
        } if (sub.length) {
          sub.sort(function (a, b) { return a[0].length - b[0].length; });
          chg = kbSelect.firstChild.nodeValue = this.VKI_kt = sub[0][1];
        } if (chg) this.VKI_buildKeys();
      }
      if (this.VKI_isIE) {
        if (!this.VKI_target.range) {
          this.VKI_target.range = this.VKI_target.createTextRange();
          this.VKI_target.range.moveStart('character', this.VKI_target.value.length);
        } this.VKI_target.range.select();
      }
      try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}
      if (this.VKI_clearPasswords && this.VKI_target.type == "password") this.VKI_target.value = "";

      var elem = this.VKI_target;
      this.VKI_target.keyboardPosition = "absolute";
      do {
        if (VKI_getStyle(elem, "position") == "fixed") {
          this.VKI_target.keyboardPosition = "fixed";
          break;
        }
      } while (elem = elem.offsetParent);

      if (this.VKI_isIE6) document.body.appendChild(this.VKI_iframe);
      document.body.appendChild(this.VKI_keyboard);
      this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;
      if (this.VKI_isOpera) this.VKI_keyboard.reflow();

      this.VKI_position(true);
      if (self.VKI_isMoz || self.VKI_isWebKit) this.VKI_position(true);
      this.VKI_target.blur();
      this.VKI_target.focus();
    } else this.VKI_close();
  };


  /* ****************************************************************
   * Position the keyboard
   *
   */
  this.VKI_position = function(force) {
    if (self.VKI_target) {
      var kPos = VKI_findPos(self.VKI_keyboard), wDim = VKI_innerDimensions(), sDis = VKI_scrollDist();
      var place = false, fudge = self.VKI_target.offsetHeight + 3;
      if (force !== true) {
        if (kPos[1] + self.VKI_keyboard.offsetHeight - sDis[1] - wDim[1] > 0) {
          place = true;
          fudge = -self.VKI_keyboard.offsetHeight - 3;
        } else if (kPos[1] - sDis[1] < 0) place = true;
      }
      if (place || force === true) {
        var iPos = VKI_findPos(self.VKI_target);
        self.VKI_keyboard.style.top = iPos[1] - ((self.VKI_target.keyboardPosition == "fixed" && !self.VKI_isIE && !self.VKI_isMoz) ? sDis[1] : 0) + fudge + "px";
        self.VKI_keyboard.style.left = Math.max(10, Math.min(wDim[0] - self.VKI_keyboard.offsetWidth - 25, iPos[0])) + "px";
        if (self.VKI_isIE6) {
          self.VKI_iframe.style.width = self.VKI_keyboard.offsetWidth + "px";
          self.VKI_iframe.style.height = self.VKI_keyboard.offsetHeight + "px";
          self.VKI_iframe.style.top = self.VKI_keyboard.style.top;
          self.VKI_iframe.style.left = self.VKI_keyboard.style.left;
        }
      }
      if (force === true) self.VKI_position();
    }
  };


  /* ****************************************************************
   * Close the keyboard interface
   *
   */
  this.VKI_close = VKI_close = function() {
    if (this.VKI_target) {
      try {
        this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard);
        if (this.VKI_isIE6) this.VKI_iframe.parentNode.removeChild(this.VKI_iframe);
      } catch (e) {}
      if (this.VKI_kt != this.VKI_kts) {
        kbSelect.firstChild.nodeValue = this.VKI_kt = this.VKI_kts;
        this.VKI_buildKeys();
      } kbSelect.getElementsByTagName('ol')[0].style.display = "";;
      this.VKI_target.focus();
      if (this.VKI_isIE) {
        setTimeout(function() { self.VKI_target = false; }, 0);
      } else this.VKI_target = false;
    }
  };


  /* ***** Private functions *************************************** */
  function VKI_addListener(elem, type, func, cap) {
    if (elem.addEventListener) {
      elem.addEventListener(type, function(e) { func.call(elem, e); }, cap);
    } else if (elem.attachEvent)
      elem.attachEvent('on' + type, function() { func.call(elem); });
  }

  function VKI_findPos(obj) {
    var curleft = curtop = 0;
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return [curleft, curtop];
  }

  function VKI_innerDimensions() {
    if (self.innerHeight) {
      return [self.innerWidth, self.innerHeight];
    } else if (document.documentElement && document.documentElement.clientHeight) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else if (document.body)
      return [document.body.clientWidth, document.body.clientHeight];
    return [0, 0];
  }

  function VKI_scrollDist() {
    var html = document.getElementsByTagName('html')[0];
    if (html.scrollTop && document.documentElement.scrollTop) {
      return [html.scrollLeft, html.scrollTop];
    } else if (html.scrollTop || document.documentElement.scrollTop) {
      return [html.scrollLeft + document.documentElement.scrollLeft, html.scrollTop + document.documentElement.scrollTop];
    } else if (document.body.scrollTop)
      return [document.body.scrollLeft, document.body.scrollTop];
    return [0, 0];
  }

  function VKI_getStyle(obj, styleProp) {
    if (obj.currentStyle) {
      var y = obj.currentStyle[styleProp];
    } else if (window.getComputedStyle)
      var y = window.getComputedStyle(obj, null)[styleProp];
    return y;
  }


  VKI_addListener(window, 'resize', this.VKI_position, false);
  VKI_addListener(window, 'scroll', this.VKI_position, false);
  this.VKI_kbsize();
  VKI_addListener(window, 'load', VKI_buildKeyboardInputs, false);
})();
