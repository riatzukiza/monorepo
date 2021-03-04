

export function train(text, m, rg) {
  if( !!text.length&& ! rg.test(text) )
  {
    m.train(2,text.split(/\W+/));
  }
}
