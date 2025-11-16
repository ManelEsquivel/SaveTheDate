import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// *******************************************************************
// ⚠️ TUS IDENTIFICADORES REALES (NO CAMBIAN) ⚠️
// *******************************************************************
const BASE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfd6X0a5VGjQW_yy3IYqTh64HLrh1yA6CWJEGJZu4HxENr3Q/formResponse";

const ENTRY_NAME = "entry.1745994476"; 
const ENTRY_Q1 = "entry.1000057";      
const ENTRY_Q2 = "entry.1509074265";   
const ENTRY_Q3 = "entry.551001831";    
const ENTRY_Q4 = "entry.1989972928";   
const ENTRY_Q5 = "entry.694289165";    

const QUIZ_COMPLETED_KEY = 'manel_carla_quiz_completed'; 

// --- ESTRUCTURA DE PREGUNTAS ---
const ALL_QUESTIONS = [
    { id: 'q1', entry: ENTRY_Q1, label: '1. ¿De quién fue la idea de tener animales en casa?', options: ['Manel', 'Carla'] },
    { id: 'q2', entry: ENTRY_Q2, label: '2. ¿Cómo se llaman los michis de Manel y Carla?', options: ['Wasabi y Abby', 'Sky y Wasabi', 'Mia y Sombra', 'Mochi y Abby'] },
    { id: 'q3', entry: ENTRY_Q3, label: '3. ¿En qué Provincia/Ciudad se comprometieron?', options: ['Roma/Fontana di trevi', 'París/ Torre Eiffel', 'Girona/Cadaqués', 'Menorca/Cala Turqueta'] },
    { id: 'q4', entry: ENTRY_Q4, label: '4. ¿Dónde fue el primer bautizo de buceo de Carla?', options: ['Tossa de Mar', 'Cadaqués', 'Illes Medes', 'Palamós'] },
    { id: 'q5', entry: ENTRY_Q5, label: '5. Número de tatuajes entre Carla y Manel', options: ['6', '7', '8', '10'] },
];

const entryMap = {
    guestName: ENTRY_NAME,
    q1: ENTRY_Q1,
    q2: ENTRY_Q2,
    q3: ENTRY_Q3,
    q4: ENTRY_Q4,
    q5: ENTRY_Q5,
};

// *******************************************************************

const QuizBodaPage = () => {
    const [currentStep, setCurrentStep] = useState(0); 
    const [answers, setAnswers] = useState({
        guestName: '', 
        q1: '', q2: '', q3: '', q4: '', q5: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useCompleted(false); 

    const currentQuestionIndex = currentStep - 2; 
    const currentQuestion = ALL_QUESTIONS[currentQuestionIndex];

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(QUIZ_COMPLETED_KEY) === 'true') {
            setIsCompleted(true);
            setCurrentStep(8); 
            const storedName = localStorage.getItem('manel_carla_quiz_name') || '';
            setAnswers(prev => ({ ...prev, guestName: storedName }));
        }
    }, []);

    const handleAnswerSelect = (value, questionId) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (currentQuestionIndex === 4) {
            handleSubmit(newAnswers);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };
    
    const handleNameChange = (e) => {
        const name = e.target.value;
        setAnswers(prev => ({ ...prev, guestName: name }));
        localStorage.setItem('manel_carla_quiz_name', name);
    };

    const handleSubmit = (finalAnswers) => { 
        setIsSubmitting(true);
        setCurrentStep(7);
        
        let submissionUrl = `${BASE_FORM_URL}?`;
        submissionUrl += `&${entryMap.guestName}=${encodeURIComponent(finalAnswers.guestName)}`; 
        submissionUrl += `&${entryMap.q1}=${encodeURIComponent(finalAnswers.q1)}`;
        submissionUrl += `&${entryMap.q2}=${encodeURIComponent(finalAnswers.q2)}`;
        submissionUrl += `&${entryMap.q3}=${encodeURIComponent(finalAnswers.q3)}`;
        submissionUrl += `&${entryMap.q4}=${encodeURIComponent(finalAnswers.q4)}`;
        submissionUrl += `&${entryMap.q5}=${encodeURIComponent(finalAnswers.q5)}`;
        submissionUrl += `&submit=Submit`;

        submissionUrl = submissionUrl.replace('?&', '?');
        window.open(submissionUrl, '_blank');

        localStorage.setItem(QUIZ_COMPLETED_KEY, 'true');
        setIsCompleted(true);
        
        setTimeout(() => { 
             setIsSubmitting(false);
             setCurrentStep(8);
        }, 2000); 
    };

    const renderStep = () => {
        if (isCompleted || currentStep === 8) {
             return (
                 <div className="step-content success-screen">
                    <h2>¡Respuestas Enviadas con Éxito! 🎉</h2>
                    <p>¡Gracias por participar **{answers.guestName || 'invitado/a'}**!</p>
                </div>
             );
        }

        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content welcome-screen">

