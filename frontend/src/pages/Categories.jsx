import { useState,useEffect } from "react";
import {getCategories,createCategory,updateCategory,deleteCategory} from '../api/categories'
import {useAuth} from '../context/useAuth';


export default function Categories(){
    const [categories,setCategories] = useState([]);
    const [loading ,setLoading] = useState(true);
    const [error,setError] = useState('');
    const [newName,setNewName]= useState('');
    const [submitting,setSubmitting] = useState(false);
    const [editingId,setEditingId] = useState(null);
    const [editName,setEditName] = useState('');
    const {isAdmin} = useAuth();


    function loadCategories(){
        setLoading(true);
        getCategories()
        .then((res)=>setCategories(res.data))
        .catch(()=>setError("Failed to load categories"))
        .finally(()=>setLoading(false));
    }

    useEffect(()=>{
         // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCategories();
    },[]);

    async function handleAuth(e){
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try{
            await createCategory({name:newName});
            setNewName('');
            loadCategories();
        }
        catch(err){
            setError(err.response?.data?.detail || 'Failed to add Categories');
        }
        finally{
            setSubmitting(false);
        }
    }

    function startEdit(cat){
        setEditingId(cat.id);
        setEditName(cat.name);
    }

    function cancelEdit(){
        setEditingId(null);
        setEditName('');
    }
    async function handleSaveEdit(id){
        setError('');
        try{
            await updateCategory(id,{name:editName});
            cancelEdit();
            loadCategories();
        }
        catch(err){
            setError(err.response?.data?.detail || 'Failed to update category');
        }
    }

    async function handleDelete(id,name){
        if (!window.confirm(`Delete "${name}"?`))  return;
        try{
            await deleteCategory(id);
            setCategories((prev)=> prev.filter((c)=>c.id !== id));
        }
        catch(err){
            alert(err.response?.data?.detail ||'Failed to delete category')
        }
    }

    return (
        <div>
            <h2>Categories</h2>
            {isAdmin && (
                <form onSubmit={handleAuth} style={{marginBottom:'1rem'}}>
                    <input type="text" placeholder="New Category Name" value={newName} onChange={(e)=>setNewName(e.target.value)} required/>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            )}

            {error && <p className="error">{error}</p>}
            {loading && <p>Loading categories...</p>}
            {!loading && categories.length===0&&<p>No categories found</p>}

            {!loading && categories.length>0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c)=>(
                            <tr key={c.id}>
                                <td>
                                    {editingId === c.id? (
                                        <input type="text" value={editName} onChange={(e)=>setEditName(e.target.value)}/>
                                    ):(c.name)}
                                </td>
                                {isAdmin && (
                                    <td>
                                        {editingId === c.id ?(
                                            <>
                                                <button onClick={handleSaveEdit(c.id)}>Save</button>
                                                <button className="secondary" onClick={cancelEdit}>Cancel</button>
                                            </>
                                        ):(
                                            <>
                                                <button onClick={()=>startEdit(c)}>Edit</button>
                                                <button className="danger" onClick={()=>handleDelete(c.id,c.name)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}