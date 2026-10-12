import {Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductList from './pages/ProductList';
import Categories from './pages/Categories';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
    return (
        <>
            <Navbar/>
            <main className='container'>
                <Routes>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/register' element={<Register/>}></Route>
                    <Route path='/' element={<ProductList/>}></Route>
                    <Route path='/add-product' element={
                        <ProtectedRoute adminOnly={true}>
                            <AddProduct/>
                        </ProtectedRoute>
                    }></Route>
                    <Route path='/edit-product/:id' element={
                        <ProtectedRoute adminOnly={true}>
                            <EditProduct/>
                        </ProtectedRoute>
                    }>
                    </Route>
                    <Route path='/categories' element={<Categories/>}></Route>
                </Routes>
            </main>
        </>
    )
}

export default App