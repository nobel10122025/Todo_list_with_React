import { useState, useEffect, useRef } from 'react';
// import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import LoadingPage from '../LoadingPage/LoadingPage';
import { targetList } from './data';
import './HomePage.scss'

function HomePage() {
 
    const [isModelLoading, setIsModelLoading] = useState(false)
    const [model, setModel] = useState(null)
    const [imageURL, setImageURL] = useState(null);
    const [results, setResults] = useState([])

    const imageRef = useRef()
    const textInputRef = useRef()
    const fileInputRef = useRef()

    const loadModel = async () => {
        setIsModelLoading(true)
        try {
            // const model = await mobilenet.load()
            const model = await tf.loadLayersModel('ResNet/model.json');
            setModel(model)
            setIsModelLoading(false)
        } catch (error) {
            console.log(error)
            setIsModelLoading(false)
        }
    }

    const preProcessing = () => {
        let tensor = tf.browser.fromPixels(imageRef.current , 3)
        .resizeNearestNeighbor([224, 224]) 
		.expandDims()
		.toFloat()
        .flatten()
        .arraySync()
        
        let tensor_processed = Object.values(tensor)
        tensor_processed = tensor_processed.map(value => ((value/255)));
         let final_tensor = tensor_processed.map((value) => ((value - 0.456)/0.255))
        console.log(final_tensor)
        return tf.tensor(final_tensor).as4D(1,224,224,3)
    }
    
    const uploadImage = (e) => {
        const { files } = e.target
        if (files.length > 0) {
            const url = URL.createObjectURL(files[0])
            setImageURL(url)
            // preProcessing(fileData)
        } else {
            setImageURL(null)
        }
    }

    const identify = async () => {
        textInputRef.current.value = ''
        const results = await model.predict(preProcessing())
        const value = results.dataSync()
        // console.log(value)
        let max = Math.max(...value)
        // console.log(max)
        const indexOfMax = value.indexOf(max)
        max = ((max*100).toFixed(2))
       console.log(indexOfMax)
        const pestName = targetList[indexOfMax]
        console.log(pestName)
        setResults([pestName])
    }

    const handleOnChange = (e) => {
        setImageURL(e.target.value)
        setResults([])
    }

    const triggerUpload = () => {
        fileInputRef.current.click()
    }

    useEffect(() => {
        loadModel()
    }, [])


    if (isModelLoading) {
        return <LoadingPage />
    }

    return (
        <div className='homePage'>
            <h1 className='header'>Coin Detection</h1>
            <div className="underline"></div>
            <div className='inputHolder'>
                <input type='file' accept='image/*' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
                <button className='uploadImage' onClick={triggerUpload}>Upload Image</button>
                <input type="text" placeholder='Paste image URL' ref={textInputRef} onChange={handleOnChange} />
            </div>
            <div className="mainWrapper">
                <div className="imageHolder">
                    {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
                </div>
                
                {imageURL && <button className='button' onClick={identify}>Detect coin</button>}
                {results.length > 0 ?
                    (<div className='resultsHolder'>   
                        <span className='name'>It's a {results[0]}</span><br/>
                    </div>) :
                    (<div className='errorHolder' style={{display: `${results.length ===0 ? 'none' : null}`}}>
                        <span className='errorMessage'>No Coin detected !! Sorry</span>
                    </div>)
                }
            </div>
        </div>
    );
}

export default HomePage;