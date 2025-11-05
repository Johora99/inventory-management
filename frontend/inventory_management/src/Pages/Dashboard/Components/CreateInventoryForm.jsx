import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import ReactMarkdown from 'react-markdown';
import useMyInventory from '../../../Hooks/useMyInventory';
import useAllInventory from '../../../Hooks/useAllInventory';
import { FaTimes } from 'react-icons/fa';

const ItemTypes = { ELEMENT: 'element', FIELD: 'field' };

const CreateInventoryForm = ({onClose, selectedIds, inventoryToEdit = null}) => {
  const [tagInput, setTagInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
   const [title, setTitle] = useState(inventoryToEdit?.title || '');
  const [description, setDescription] = useState(inventoryToEdit?.description || '');
  const [category, setCategory] = useState(inventoryToEdit?.category || '');
  const [isOther, setIsOther] = useState(inventoryToEdit?.category === 'Other');
  const [image, setImage] = useState(null); 
  const [tags, setTags] = useState(inventoryToEdit?.tags || []);
  const [isPublic, setIsPublic] = useState(inventoryToEdit?.isPublic ?? true);
  const [accessUsers, setAccessUsers] = useState(inventoryToEdit?.accessUsers || []);
  const [customIdElements, setCustomIdElements] = useState(inventoryToEdit?.customIdElements || []);
  const [customFields, setCustomFields] = useState(inventoryToEdit?.customFields || []);
  const [previewId, setPreviewId] = useState(inventoryToEdit?.customId || '');
  const [draftId, setDraftId] = useState(inventoryToEdit?.id || null);
  const [version, setVersion] = useState(inventoryToEdit?.version || 0);
  const {myInventory, isLoading, refetch} = useMyInventory()
  // const { allInventory = [], isLoading, refetch } = useAllInventory();
  const axiosSecure = useAxiosSecure();
 console.log(inventoryToEdit)
  const plainObject = {
    title,
    description,
    category,
    image,
    tags,
    isPublic,
    accessUsers,
    customIdElements,
    customFields,
    version,
  };
console.log(plainObject)
  useEffect(() => {
    if (tagInput) {
      axiosSecure.get(`/api/inventory/tags/suggest?query=${tagInput}`)
        .then(res => {
          const data = res.data;
          const suggestions = Array.isArray(data) ? data : data.suggestions || [];
          setTagSuggestions(suggestions);
        })
        .catch(() => setTagSuggestions([]));
    }
  }, [tagInput]);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        if (!userInput || isPublic) {
          setUserSuggestions([]);
          return;
        }
        const response = await axiosSecure.get(`/api/inventory/users/suggest?query=${userInput}`);
        if (Array.isArray(response.data)) {
          setUserSuggestions(response.data);
        } else {
          setUserSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
        setUserSuggestions([]);
      }
    };
    fetchUserSuggestions();
  }, [userInput, isPublic]);

  useEffect(() => {
    clearTimeout(autoSaveTimer);
    setAutoSaveTimer(setTimeout(saveDraft, 8000));
    return () => clearTimeout(autoSaveTimer);
  }, [title, description, category, tags, isPublic, accessUsers, customIdElements, customFields]);

  const saveDraft = async () => {
    try {
      const formData = getFormData();
      const res = await axiosSecure.post('/api/inventory/draft', formData);
      if (res.data.id && !draftId) {
        setDraftId(res.data.id);
        localStorage.setItem("draftId", res.data.id);
      }
      if (res.data.version) {
        setVersion(res.data.version);
      }
    } catch (err) {
      // console.error("Save failed", err);
    }
  };

const getFormData = () => {
  const formData = new FormData();

  if (draftId) formData.append("id", draftId);

  // For updates: include only fields that are not empty or changed
  if (!inventoryToEdit || title) formData.append('title', title);
  if (!inventoryToEdit || description) formData.append('description', description);
  if (!inventoryToEdit || category) formData.append('category', category);
  if (image) formData.append('image', image);
  if (!inventoryToEdit || tags.length > 0) formData.append('tags', JSON.stringify(tags));
  if (!inventoryToEdit || isPublic !== undefined) formData.append('isPublic', isPublic);
  if (!inventoryToEdit || accessUsers.length > 0) formData.append('accessUsers', JSON.stringify(accessUsers));
  if (!inventoryToEdit || customIdElements.length > 0) formData.append('customIdElements', JSON.stringify(customIdElements));
  if (!inventoryToEdit || customFields.length > 0) formData.append('customFields', JSON.stringify(customFields));
  if (previewId) formData.append('customId', previewId);
 formData.append('version', version ?? 0); // always send version


  return formData;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // Generate final custom ID
  let finalCustomId = '';
  customIdElements.forEach(el => {
    switch(el.type) {
      case 'fixed':
        finalCustomId += el.value || '';
        break;
      case 'random20':
        finalCustomId += Math.floor(Math.random() * (2**20)).toString(16).padStart(5, '0');
        break;
      case 'random32':
        finalCustomId += Math.floor(Math.random() * (2**32)).toString(16).padStart(8, '0');
        break;
      case 'random6':
        finalCustomId += Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
        break;
      case 'random9':
        finalCustomId += Math.floor(Math.random() * 1e9).toString().padStart(9, '0');
        break;
      case 'guid':
        finalCustomId += crypto.randomUUID();
        break;
      case 'datetime':
        finalCustomId += new Date().toISOString().replace(/[-:.TZ]/g, '');
        break;
      case 'sequence':
        finalCustomId += 'SEQ'; 
        break;
      default:
        break;
    }
  });

try {
  let res;

  const payload = {
    title,
    description,
    category,
    tags,
    isPublic,
    accessUsers,
    customIdElements,
    customFields,
    customId: previewId,
    custom_id: finalCustomId,
    version,
  };

  // Function to create FormData from payload
  const createFormData = (data, imageFile) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object") formData.append(key, JSON.stringify(value));
      else formData.append(key, value);
    });
    if (imageFile) formData.append("image", imageFile);
    return formData;
  };

  // Multiple inventory edit
  if (inventoryToEdit && Array.isArray(inventoryToEdit)) {
    const promises = inventoryToEdit.map(item => {
      const itemPayload = {
        ...payload,
        // override fields for this specific item if needed
      };

      const formData = image ? createFormData(itemPayload, image) : itemPayload;

      return axiosSecure.patch(`/api/inventory/edit/${item._id}`, formData);
    });

    res = await Promise.all(promises);
  } 
  // Single inventory edit
  else if (inventoryToEdit) {
    const formData = image ? createFormData(payload, image) : payload;
    res = await axiosSecure.patch(`/api/inventory/edit/${inventoryToEdit._id}`, formData);
  } 
  // Create new inventory
  else {
    const formData = image ? createFormData(payload, image) : payload;
    res = await axiosSecure.post('/api/inventory/createInventories', formData);
  }

  console.log(res);
  alert(Array.isArray(res) ? "All inventories updated successfully!" : res?.data?.message);
  refetch();
  onClose();
} catch (err) {
  console.error('Submit error:', err);
  const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
  alert('Error: ' + errorMessage);
}
}


  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      console.log('Tags:', newTags);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      console.log('Tag Input Entered:', tagInput.trim());
    }
  };

  const addUser = (user) => {
    if (!accessUsers.find(u => u.email === user.email)) setAccessUsers([...accessUsers, user]);
    setUserInput('');
  };

  const sortUsers = (by) => {
    const sorted = [...accessUsers].sort((a, b) => a[by].localeCompare(b[by]));
    setAccessUsers(sorted);
  };

useEffect(() => {
  const updatedElements = customIdElements.map(el => {
    let value = el.value;
    switch(el.type) {
      case 'fixed':
        break; // use the existing value
      case 'random20':
        value = Math.floor(Math.random() * (2**20)).toString(16).padStart(5, '0');
        break;
      case 'random32':
        value = Math.floor(Math.random() * (2**32)).toString(16).padStart(8, '0');
        break;
      case 'random6':
        value = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
        break;
      case 'random9':
        value = Math.floor(Math.random() * 1e9).toString().padStart(9, '0');
        break;
      case 'guid':
        value = crypto.randomUUID();
        break;
      case 'datetime':
        value = new Date().toISOString().replace(/[-:.TZ]/g, '');
        break;
      case 'sequence':
        value = 'SEQ';
        break;
      default:
        break;
    }
    return { ...el, value };
  });

  setCustomIdElements(updatedElements);
  setPreviewId(updatedElements.map(el => el.value).join('-'));
}, [customIdElements.length]);



  const moveElement = (dragIndex, hoverIndex) => {
    const dragged = customIdElements[dragIndex];
    const newElements = [...customIdElements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, dragged);
    setCustomIdElements(newElements);
  };

  const Element = ({ id, index, type, value, moveElement }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.ELEMENT,
      hover: (item) => {
        if (item.index !== index) {
          moveElement(item.index, index);
          item.index = index;
        }
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.ELEMENT,
      item: { id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    return (
      <div 
        ref={(node) => drag(ref(node))} 
        className={`flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm mb-2 cursor-move transition-all hover:border-blue-400 hover:shadow-md ${isDragging ? 'opacity-50 scale-95' : ''}`}
      >
        <div className="flex items-center gap-3">
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
  </svg>

  {type === 'fixed' ? (
    <input
      type="text"
      value={value}
      placeholder="Enter fixed text"
      onChange={e => {
        const newElements = [...customIdElements];
        newElements[index].value = e.target.value;
        setCustomIdElements(newElements);
      }}
      className="border-b border-gray-300 focus:outline-none focus:border-teal-500 px-1 text-gray-700"
    />
  ) : (
    <span className="font-medium text-gray-700">{type === 'fixed' ? '📝 Fixed Text' : '🎲 Random ID'}</span>
  )}

  <span className="text-sm text-gray-500">{type !== 'fixed' ? value || '(empty)' : ''}</span>
</div>

        <button 
          type="button"
          onClick={() => removeElement(index)} 
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
        >
          ✕
        </button>
      </div>
    );
  };

const addElement = (type) => {
  if (customIdElements.length < 10) {
    let value = '';
    switch(type) {
      case 'fixed': value = ''; break;
      case 'random20': value = Math.floor(Math.random() * (2**20)).toString(16).padStart(5, '0'); break;
      case 'random32': value = Math.floor(Math.random() * (2**32)).toString(16).padStart(8, '0'); break;
      case 'random6': value = Math.floor(Math.random() * 1e6).toString().padStart(6, '0'); break;
      case 'random9': value = Math.floor(Math.random() * 1e9).toString().padStart(9, '0'); break;
      case 'guid': value = crypto.randomUUID(); break;
      case 'datetime': value = new Date().toISOString().replace(/[-:.TZ]/g, ''); break;
      case 'sequence': value = 'SEQ'; break;
      default: break;
    }
    setCustomIdElements([...customIdElements, { type, value }]);
  }
};

useEffect(() => {
  setPreviewId(customIdElements.map(el => el.value).join('-'));
}, [customIdElements]);


  const removeElement = (index) => {
    const newElements = customIdElements.filter((_, i) => i !== index);
    setCustomIdElements(newElements);
  };

  const addCustomField = (type) => {
    const limits = { text: 3, multiline: 3, numeric: 3, link: 3, boolean: 3 };
    const count = customFields.filter(f => f.type === type).length;
    if (count < limits[type]) {
      setCustomFields([...customFields, { type, title: '', description: '', showInTable: false }]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white shadow-sm rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-8 text-white">
            <div className='flex items-center justify-between'>
              <h2 className="text-4xl font-bold mb-2">Create New Inventory</h2>
               <button onClick={onClose} className='cursor-pointer'><FaTimes className='text-2xl'/></button>
            </div>
            <p className="text-blue-100">Fill in the details to add a new inventory item</p>
          </div>
          <div className="p-8 space-y-8">
            
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               Basic Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter inventory title..."
                    required={!inventoryToEdit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Markdown)</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none min-h-32"
                    placeholder="Add a detailed description..."
                  />
                  {description && (
                    <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 mb-2">PREVIEW:</p>
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
  
  <select
    value={isOther ? "Other" : category}  // show Other if isOther is true
    onChange={e => {
      const value = e.target.value;
      if (value === "Other") {
        setIsOther(true);
        setCategory("");  // clear category for custom input
      } else {
        setIsOther(false);
        setCategory(value);
      }
    }}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-white"
  >
    <option value="" disabled>Select Category</option>
    <option value="Equipment">Equipment</option>
    <option value="Furniture">Furniture</option>
    <option value="Book">Book</option>
    <option value="Other">Other</option>
  </select>

  {/* Show input field if "Other" is selected */}
  {isOther && (
    <input
      type="text"
      value={category}
      onChange={e => setCategory(e.target.value)}
      placeholder="Enter custom category"
      className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
    />
  )}
</div>


                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                    <input 
                      type="file" 
                      onChange={e => setImage(e.target.files[0])} 
                      className="w-full px-4 py-1 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Tags
              </h3>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all outline-none"
                />
                {tagInput && Array.isArray(tagSuggestions) && tagSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white border-2 border-purple-200 rounded-lg shadow-xl mt-2 z-10 max-h-48 overflow-y-auto">
                    {tagSuggestions
                      .filter((s) => !tags.includes(s))
                      .map((tag) => (
                        <div
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="cursor-pointer px-4 py-3 hover:bg-purple-50 transition-colors border-b last:border-b-0"
                        >
                          {tag}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                ))}
                {tags.length === 0 && (
                  <p className="text-gray-400 italic">No tags added yet</p>
                )}
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               Privacy Settings
              </h3>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isPublic} 
                    onChange={e => setIsPublic(!isPublic)}
                    className="w-4 h-4 rounded border-2 border-gray-300 checked:bg-teal-500 checked:border-teal-500 cursor-pointer"
                  />
                </div>
                <span className="text-lg font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                  Make this inventory public
                </span>
              </label>

              {!isPublic && (
                <div className="mt-6 p-6 bg-white rounded-lg border-2 border-green-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Add Users (Private Access)</h4>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Search user by name or email..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
                    />
                    {userInput && Array.isArray(userSuggestions) && userSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 bg-white border-2 border-green-200 rounded-lg shadow-xl mt-2 z-10 max-h-48 overflow-y-auto">
                        {userSuggestions
                          .filter((s) => !accessUsers.some((u) => u.email === s.email))
                          .map((user) => (
                            <div
                              key={user.email}
                              onClick={() => addUser(user)}
                              className="cursor-pointer px-4 py-3 hover:bg-green-50 transition-colors border-b last:border-b-0"
                            >
                              <span className="font-medium">{user.name}</span>
                              <span className="text-gray-500 text-sm ml-2">({user.email})</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {accessUsers.length > 0 ? (
                      accessUsers.map((u) => (
                        <div
                          key={u.email}
                          className="flex justify-between items-center bg-gradient-to-r from-green-50 to-teal-50 px-4 py-3 rounded-lg border border-green-200"
                        >
                          <div>
                            <span className="font-semibold text-gray-800">{u.name}</span>
                            <span className="text-gray-500 text-sm ml-2">({u.email})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setAccessUsers(accessUsers.filter((au) => au.email !== u.email))
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4 italic">No users added yet</p>
                    )}
                  </div>

                  {accessUsers.length > 1 && (
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => sortUsers('name')}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Sort by Name
                      </button>
                      <button
                        type="button"
                        onClick={() => sortUsers('email')}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Sort by Email
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom ID Elements Section */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               Custom ID Elements
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-6">
  {['fixed','random20','random32','random6','random9','guid','datetime','sequence'].map(type => (
    <button 
      key={type}
      type="button"
      onClick={() => addElement(type)}
      className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
    >
      + {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  ))}
</div>


              <div className="space-y-2 mb-6">
                {customIdElements.map((el, index) => (
                  <Element key={index} index={index} id={index} type={el.type} value={el.value} moveElement={moveElement} />
                ))}
                {customIdElements.length === 0 && (
                  <p className="text-gray-400 text-center py-8 italic">No ID elements added yet. Click the buttons above to add some.</p>
                )}
              </div>

              {previewId && (
                <div className="p-4 bg-white border-2 border-orange-200 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 mb-1">ID PREVIEW:</p>
                  <p className="text-lg font-mono font-bold text-orange-600">{previewId}</p>
                </div>
              )}
            </div>

            {/* Custom Fields Section */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 Custom Fields
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => addCustomField('text')}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  + Text
                </button>
                <button 
                  type="button"
                  onClick={() => addCustomField('multiline')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  + Multiline
                </button>
                <button 
                  type="button"
                  onClick={() => addCustomField('numeric')}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  + Numeric
                </button>
                <button 
                  type="button"
                  onClick={() => addCustomField('link')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  + Link
                </button>
                <button 
                  type="button"
                  onClick={() => addCustomField('boolean')}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  + Boolean
                </button>
              </div>

              <div className="space-y-4">
                {customFields.map((field, index) => (
                  <div key={index} className="p-5 bg-white border-2 border-cyan-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        {field.type.toUpperCase()}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setCustomFields(customFields.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Field Title" 
                        onChange={e => { 
                          const newFields = [...customFields]; 
                          newFields[index].title = e.target.value; 
                          setCustomFields(newFields); 
                        }} 
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all outline-none"
                      />
                      <input 
                        type="text"
                        placeholder="Field Description" 
                        onChange={e => { 
                          const newFields = [...customFields]; 
                          newFields[index].description = e.target.value; 
                          setCustomFields(newFields); 
                        }} 
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all outline-none"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.showInTable} 
                          onChange={e => { 
                            const newFields = [...customFields]; 
                            newFields[index].showInTable = e.target.checked; 
                            setCustomFields(newFields); 
                          }}
                          className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer"
                        />
                        <span className="font-medium text-gray-700">Show in Table</span>
                      </label>
                    </div>
                  </div>
                ))}
                {customFields.length === 0 && (
                  <p className="text-gray-400 text-center py-8 italic">No custom fields added yet. Click the buttons above to add some.</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
              >
             {inventoryToEdit ? 'Update Inventory' : 'Create Inventory'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DndProvider>
  );
};

export default CreateInventoryForm;