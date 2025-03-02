import Input from './Input'
 
export default function QtyInput(props) {
 
   const [inputValue, setInputValue] = props.qtyState

   const hasCallbackProps = props.hasOwnProperty('callback')
 
   async function handleChange (event) {
      const value = Number(event?.target?.value)
      setInputValue(value)
      if(hasCallbackProps && value > 0) await props?.callback(value) 
   }

   function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }   

   function numberOnly(event) {
   if (!/[0-9]/.test(event.key)) event.preventDefault()
   }

   function ctrlInput(isAddSymbol = false) {
      if (isAddSymbol) {
      setInputValue((prevState) => {
         const currState = prevState + 1
         if(hasCallbackProps) props?.callback(currState)
         return currState
      })
      } else {
      setInputValue((prevState) => {
      if (prevState <= 1 ) return 1
         const currState = prevState - 1
         if(hasCallbackProps) props?.callback(currState)
         return currState
      })
      }
   }

   return (
      <div className='qtyInputContainer'>
      <div className='qtyInputCtrl' onClick={() => ctrlInput()}>-</div>
      <Input type='text' className='qtyInput'
         onChange={handleChange} onKeyPress={numberOnly} value={numberWithCommas(inputValue)}
      />
      <div className='qtyInputCtrl' onClick={() => ctrlInput(true)}>+</div>
   </div>
   )
}