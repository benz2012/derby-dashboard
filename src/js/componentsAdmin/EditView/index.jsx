import React from 'react'

const EditView = ({ ...rest }) => (
  <div>null</div>
)

export default EditView


// const EditPane = ({ items, match }) => {
//   if (!items) return null
//   console.log(match)
//   const obj = items.find(i => parseInt(i.id) === parseInt(match.params.id))
//   console.log(obj)
//   return (<Modal>
//     <div
//       className="card"
//       style={{ zIndex: '150', position: 'fixed', width: '60%', height: '80%', marginTop: '5%', marginLeft: '20%' }}
//     >
//       <div className="card-body">
//         {
//           Object.keys(obj).map(k => (
//             <p key={k} className="card-text">{k}: {obj[k]}</p>
//           ))
//         }
//       </div>
//     </div>
//   </Modal>)
// }
