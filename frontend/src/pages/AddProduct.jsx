import { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { createProduct } from "../api/products";
import {getCategories} from "../api/categories"


export default function AddProduct(){
    const [categories,setCategories] = useState([]);
    const [form,setForm] = useState({
        name:'',
        description:'',
        price:'',
        cost_price:'',
        category_id:'',
    });
    const [error,setError] = useState('');
    const [submitting,setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        getCategories()
        .then((res)=>setCategories(res.data))
        .catch(()=>setError('Failed to load Categories'));
    },[]);
    function handleChange(e){
        const {name,value} = e.target;
        setForm((prev) => ({...prev,[name]:value}));
    }

    async function handleSubmit(e){
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try{
            await createProduct({
                name:form.name,
                description:form.description,
                price:parseFloat(form.price),
                cost_price:form.cost_price?parseFloat(form.cost_price) : null,
                category_id:parseInt(form.category_id,10),
            });
            navigate('/');
        }
        catch(err){
            setError(err.response?.data?.detail || "Failed to add Product")
        }
        finally{
            setSubmitting(false);
        }
    }

    return(
        <div className="card">
            <h2>Add product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={form.description} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" name="price" step='0.01' value={form.price} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Cost Price</label>
                    <input type="number" name="cost_price" step='0.01' value={form.cost_price} onChange={handleChange}/>
                </div>
                <div>
                    <label>Category</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange} required>
                          <option value=''>-- Select a Category --</option>  
                          {categories.map((c)=>(
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}                   
                    </select>
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type="submit" disabled={submitting}>{submitting ? 'Adding...' :'Add Product'}</button>
            </form>
        </div>
    );
}