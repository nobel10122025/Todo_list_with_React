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
        // console.log(tensor)
        
        let tensor_processed = Object.values(tensor)
        let tensor_final = tf.tensor(tensor_processed).as4D(1,224,224,3)
        tensor_processed = tensor_final.div(255).sub([0.485, 0.456, 0.406]).div([0.229, 0.224, 0.225]);
        return tensor_processed
    }
    
    const uploadImage = (e) => {
        const { files } = e.target
        if (files.length > 0) {
            const url = URL.createObjectURL(files[0])
            setImageURL(url)
        } else {
            setImageURL(null)
        }
    }

    const identify = async () => {
        fileInputRef.current.value = ''
        const results = await model.predict(preProcessing())
        const value = results.dataSync()
        let max = Math.max(...value)
        let indexOfMax = ((value.indexOf(max))+1) 
        max = ((max*100).toFixed(2))
        indexOfMax = String(indexOfMax)
        const coinName = targetList[indexOfMax]
        setResults([coinName , max])
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
            <div className='inputHolder'>
                <input type='file' accept='image/*' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
                <button className='uploadImage' onClick={triggerUpload}>Upload Image</button>
            </div>
            <div className="mainWrapper">
                <div className="imageHolder">
                    {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
                </div>
                
                {imageURL && <button className='button' onClick={identify}>Detect coin</button>}
                {results.length > 0  && results[1] > 50?
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