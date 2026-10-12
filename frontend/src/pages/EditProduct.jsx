import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct,updateProduct } from "../api/products";
import { getCategories } from "../api/categories";


export default function EditProduct(){
    const {id} = useParams();
    const [categories,setCategories] = useState([]);
    const [form,setForm] = useState(null);
    const [error,setError]=useState('');
    const [submitting,setSubmitting] = useState(false);
    const navigate= useNavigate();

    useEffect(()=>{
        Promise.all([getProduct(id),getCategories()])
        .then(([productRes,categoriesRes])=>{
            const p = productRes.data;
            setForm({
                name:p.name,
                description:p.description,
                price:p.price,
                cost_price:'',
                category_id:p.category.id,
            });
            setCategories(categoriesRes.data);
        })
        .catch(()=>setError('Failed to load product'));
    },[id]);

    function handleChange(e){
        const {name,value} = e.target;
        setForm((prev) => ({...prev,[name]:value}));
    }

    async function handleSubmit(e){
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try{
            await updateProduct(id,{
                name:form.name,
                description:form.description,
                price:parseFloat(form.price),
                cost_price:null,
                category_id:parseInt(form.category_id,10),
            });
            navigate('/');
        }
        catch(err){
            setError(err.response?.data?.detail || 'Failed to update product');
        }
        finally{
            setSubmitting(false);
        }
    }

    if (error && !form) return <p style={{color:'red'}}>{error}</p>;
    if(!form) return <p>Loading....</p>;

    return (
        <div className="card">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}/>
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={form.description} onChange={handleChange}/>
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange}/>
                </div>
                <div>
                    <label>Category</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange}>
                        {categories.map((c)=>(
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Saving....': 'Save Changes'}
                </button>
            </form>
        </div>
    );
}