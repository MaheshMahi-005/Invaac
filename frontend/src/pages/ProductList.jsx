import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts,deleteProduct } from "../api/products";
import { useAuth } from "../context/useAuth";


const PAGE_SIZE = 5;

export default function ProductList(){
    const [products,setProducts] = useState([]);
    const [total,setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState('');
    const [search,setSearch] = useState('');
    const [page,setPage] = useState(0);
    const {isAdmin} = useAuth();
    const navigate = useNavigate();


    useEffect(()=>{
        const timer =  setTimeout(()=>{
        setLoading(true);
        getProducts({search:search || undefined,skip:page*PAGE_SIZE,limit:PAGE_SIZE})
        .then((res)=>{setProducts(res.data.items);
            setTotal(res.data.total);
        })
        .catch(()=>setError('Failed to load products'))
        .finally(()=>setLoading(false));
        },350);

        return ()=> clearTimeout(timer);
    },[search,page]);

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(0);
    },[search]);


    async function handleDelete(id,name){
        if (!window.confirm(`Delete "${name}"?This cannot be undone.`)) return;
        try{
            await deleteProduct(id);
            setProducts((prev)=>prev.filter((p)=>p.id !== id));
            setTotal((prev)=>prev-1);
        }
        catch(err){
            alert(err.response?.data?.detail || 'Failed to delete product');
        }
    }
    
    const totalPages = Math.max(1,Math.ceil(total/PAGE_SIZE));

    return(
        <div>
            <h2>Products</h2>
            <input type="text" placeholder="Search Products...." value={search} 
            onChange={(e) => setSearch(e.target.value)}/>

            {loading && <p>Loading Products.....</p>}
            {!loading && error && <p className="error">{error}</p>}
            {!loading && !error && products.length === 0 && <p>No Products found</p>}

            {!loading && !error && products.length > 0 && 
            (<table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map((p)=>(
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.price}</td>
                            <td>{p.category.name}</td>
                            {isAdmin && (
                                <td>
                                    <button onClick={()=>navigate(`/edit-product/${p.id}`)}>Edit</button>
                                    <button className="danger" onClick={()=>handleDelete(p.id,p.name)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>)}

            {!loading && !error && total>0 &&(
                <div className="pagination">
                    <button onClick={()=>setPage((p)=>Math.max(0,p-1))} disabled={page === 0}>Previous</button>
                    <span>{page+1} of {totalPages}</span>
                    <button onClick={()=> setPage((p)=> p+1)}
                    disabled={page+1>=totalPages}>Next</button>
                </div>
            )}

        </div>
    )
}