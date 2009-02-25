CodeHighlighter.addStyle("ruby",{
 comment : {
  exp  : /#[^\n]+/
 },
 brackets : {
  exp  : /\(|\)/
 },
 string : {
  exp  : /'[^']*'|"[^"]*"/
 },
 keywords : {
  exp  : /\b(do|end|self|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|raise)\b/
 },
 symbol   : {
  exp  : /([^:])(:[A-Za-z0-9_!?]+)/,
                replacement : "$1<span class=\"$0\">$2</span>"
 }
});
