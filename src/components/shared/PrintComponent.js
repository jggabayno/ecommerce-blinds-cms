import { forwardRef} from 'react'


const PrintComponent = forwardRef((props, ref) => {
    return (
    <div ref={ref} className='print-view'>
        <div className='print-view-header'>
          <div className='logo'></div>
          <section>
            <h1>(Business Name) Blinds</h1>
            <p>Address</p>
            <small>Email: test@example.com</small>
          </section>
        </div>
        <div className='print-view-content'>
            {props.children}
        </div>

    </div>
    )
})

export default PrintComponent;