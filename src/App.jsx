import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSterlingSign } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [input, setInput] = useState({
    amount: '',
    term: '',
    interest: '',
    type: ''
  });

  const [values, setValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'amount') {
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedValue = formatNumberWithCommas(numericValue);
      setInput({
        ...input,
        [name]: formattedValue
      });
    } else {
      setInput({
        ...input,
        [name]: value
      });
    }
  };

  const clearInput = () => {
    setInput({
      amount: '',
      term: '',
      interest: '',
      type: ''
    });
    setErrors({});
    setMonthlyPayment(null);
    setTotalPayment(null);
    setShowResults(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateInputs(input);
    if (Object.keys(newErrors).length === 0) {
      calculateMortgage(input);
      setValues([...values, input]);
      setShowResults(true);
    } else {
      setErrors(newErrors);
    }
  };

  const validateInputs = (inputs) => {
    const errors = {};

    const numericAmount = inputs.amount.replace(/,/g, '');
    const numericTerm = inputs.term;
    const numericInterest = inputs.interest;

    // Validate mortgage amount
    if (!inputs.amount) {
      errors.amount = 'This field is required';
    } else if (isNaN(numericAmount) || Number(numericAmount) <= 0) {
      errors.amount = 'Please enter a valid mortgage amount greater than zero';
    }

    // Validate mortgage term
    if (!inputs.term) {
      errors.term = 'This field is required';
    } else if (isNaN(numericTerm) || Number(numericTerm) <= 0) {
      errors.term = 'Please enter a valid mortgage term greater than zero';
    }

    // Validate interest rate
    if (!inputs.interest) {
      errors.interest = 'This field is required';
    } else if (isNaN(numericInterest) || Number(numericInterest) <= 0) {
      errors.interest = 'Please enter a valid interest rate greater than zero';
    }

    // Validate mortgage type
    if (!inputs.type) {
      errors.type = 'This field is required';
    }

    return errors;
  };

  const calculateMortgage = ({ amount, term, interest, type }) => {
    const P = parseFloat(amount.replace(/,/g, ''));
    const annualRate = parseFloat(interest) / 100;
    const r = annualRate / 12;
    const n = parseFloat(term) * 12;

    let M;
    if (type === 'repayment') {
      if (r === 0) {
        M = P / n;
      } else {
        M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      setTotalPayment((M * n).toFixed(2));
    } else if (type === 'interest-only') {
      M = P * r;
      setTotalPayment((M * n).toFixed(2));
    }

    setMonthlyPayment(M.toFixed(2));
  };

  const isAnyInputFilled = () => {
    return input.amount || input.term || input.interest || input.type;
  };

  return (
    <main className="bg-neutral-white rounded-2xl lg:max-w-4xl w-full shadow-lg h-full lg:flex gap-2">
      <section className="px-5 bg-white lg:w-1/2 lg:rounded-2xl">
        <div className="p-2 md:flex justify-between">
          <h1 className="font-bold text-3xl pt-4 text-neutral-slate900 lg:text-xl">Mortgage Calculator</h1>
          <button
            className="text-lg text-neutral-slate700 underline md:pt-5 lg:pt-5 lg:text-sm hover:font-semibold hover:text-neutral-slate900"
            onClick={clearInput}
          >
            Clear All
          </button>
        </div>
        <div className="pt-3">
          <p className={`text-lg pb-2 lg:text-base`}>Mortgage Amount</p>
          <label className={`flex items-center border ${errors.amount ? "border-primary-red border-[1.5px] hover:border-primary-red" : "border-neutral-slate700"} ${focusedInput === 'amount' ? 'border-[1.5px] border-primary-lime hover:border-primary-lime' : 'border-neutral-slate700'} hover:border-neutral-slate900 hover:border-[1.5px] h-12 shadow-sm bg-white rounded-lg pr-1`}>
            <div className={`${errors.amount ? "bg-primary-red" : "bg-neutral-slate100"} ${focusedInput === 'amount' ? 'bg-primary-lime' : 'bg-neutral-slate100'} p-2 w-14 h-[2.82rem] rounded-l-md mr-2 text-center cursor-pointer`}>
              <FontAwesomeIcon icon={faSterlingSign} className={`${errors.amount ? "text-neutral-slate100" : "text-neutral-slate700"} fa-xl lg:fa-md flex items-center justify-center pl-2 pt-1`} />
            </div>
            <input
              className="flex-1 border-none outline-none p-2 text-gray-700 font-semibold cursor-pointer"
              type="text"
              name="amount"
              value={input.amount}
              onChange={handleChange}
              onFocus={() => setFocusedInput('amount')}
              onBlur={() => setFocusedInput('')}
            />
          </label>
          {errors.amount && <p className="text-sm pt-1 text-primary-red">{errors.amount}</p>}

          <div className="md:flex md:gap-20 w-full lg:w-1/2 lg:gap-10">
            <div className="w-full lg:w-max">
              <p className={`text-lg mt-2 pt-2 pb-2 lg:text-base`}>Mortgage Term</p>
              <label className={`flex items-center border ${errors.term ? "border-primary-red border-[1.5px] hover:border-primary-red" : "border-neutral-slate700"} ${focusedInput === 'term' ? 'border-[1.5px] border-primary-lime hover:border-primary-lime' : 'border-neutral-slate700'} hover:border-[1.5px] hover:border-neutral-slate900 rounded-lg h-12 shadow-sm bg-white pl-1 cursor-pointer`}>
                <input
                  className="flex-1 border-none outline-none p-2 text-gray-700 lg:w-28 font-semibold cursor-pointer"
                  type="text"
                  name="term"
                  value={input.term}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('term')}
                  onBlur={() => setFocusedInput('')}
                />
                <p className={`${errors.term ? "bg-primary-red text-neutral-slate100" : "bg-neutral-slate100 text-neutral-slate700"} ${focusedInput === 'term' ? 'bg-primary-lime' : 'bg-neutral-slate100'}  w-24 lg:w-16 p-2 h-[2.82rem] rounded-r-md text-center text-base ml-2`}>years</p>
              </label>
              {errors.term && <p className="text-sm pt-1 text-primary-red">{errors.term}</p>}
            </div>
            <div className="w-full lg:w-max">
              <p className={`text-lg mt-2 pt-2 pb-2 lg:text-base `}>Interest Rate</p>
              <label className={`flex items-center border ${errors.interest ? "border-primary-red border-[1.5px] hover:border-primary-red" : "border-neutral-slate700"} ${focusedInput === 'interest' ? 'border-[1.5px] border-primary-lime hover:border-primary-lime' : 'border-neutral-slate700'} hover:border-[1.5px] hover:border-neutral-slate900 rounded-lg h-12 shadow-sm bg-white pl-1 cursor-pointer`}>
                <input
                  className="flex-1 border-none outline-none p-2 text-gray-700 lg:w-28 font-semibold cursor-pointer"
                  type="text"
                  name="interest"
                  value={input.interest}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('interest')}
                  onBlur={() => setFocusedInput('')}
                />
                <p className={`${errors.interest ? "bg-primary-red text-neutral-slate100" : "bg-neutral-slate100 text-neutral-slate700"} ${focusedInput === 'interest' ? 'bg-primary-lime' : 'bg-neutral-slate100'} w-24 lg:w-14 p-2 h-[2.82rem] rounded-r-md text-center text-lg ml-2`}>%</p>
              </label>
              {errors.interest && <p className="text-sm pt-1 text-primary-red">{errors.interest}</p>}
            </div>
          </div>
          <div className="pb-1">
            <p className="text-lg text-neutral-slate700 mt-2 pt-2 pb-2 lg:text-base">Mortgage Type</p>
            <div className="flex flex-col gap-4">
              <label className="flex items-center border border-neutral-slate700 rounded-lg p-3 shadow-sm bg-white radio-label hover:border-primary-lime hover:border-[1.5px] cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="repayment"
                  className="custom-radio"
                  onChange={handleChange}
                  checked={input.type === 'repayment'}
                />
                <span className="text-gray-700 pl-3 font-bold">Repayment</span>
              </label>
              <label className="flex items-center border border-neutral-slate700 rounded-lg p-3 shadow-sm bg-white radio-label hover:border-primary-lime hover:border-[1.5px] cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="interest-only"
                  className="custom-radio"
                  onChange={handleChange}
                  checked={input.type === 'interest-only'}
                />
                <span className="text-gray-700 pl-3 font-bold">Interest Only</span>
              </label>
            </div>
            {errors.type && <p className="text-sm text-primary-red">{errors.type}</p>}
          </div>
          <button
            className="flex items-center justify-center p-3 bg-primary-lime rounded-full my-4 w-full font-semibold hover:bg-primary-lime/80 cursor-pointer"
            onClick={handleSubmit}
            disabled={!isAnyInputFilled()}
          >
            <img src="/assets/images/icon-calculator.svg" alt="Calculator Icon" className="pr-2" />Calculate Repayments
          </button>
        </div>
      </section>
      {!showResults && (
        <section className="bg-neutral-slate900 mt-8 lg:w-1/2 lg:mt-0 rounded-bl-4xl lg:rounded-r-2xl">
          <div className="flex items-center justify-center pt-3 lg:mt-14">
            <img src="/assets/images/illustration-empty.svg" alt="Illustration" />
          </div>
          <div className="text-center leading-loose p-3">
            <h2 className="text-neutral-slate100 font-semibold text-xl p-2">Results shown here</h2>
            <p className="text-base lg:text-sm font-thin text-[#7C9AAC]">Complete the form and click “calculate repayments” to see what your monthly repayments would be.</p>
          </div>
          <div className='text-center text-sm text-neutral-slate100 py-2 lg:mt-20 lg:text-xs'>
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" className='text-blue-500 text-base hover:underline lg:text-sm'>Frontend Mentor</a>. 
            Coded by <a href="https://github.com/JasperMunene" className='text-blue-500 text-base hover:underline lg:text-sm'>Jasper.</a>
          </div>
        </section>
      )}
      {showResults && (
        <section className="bg-[#133040] mt-8 lg:w-1/2 lg:mt-0 rounded-bl-4xl lg:rounded-r-2xl">
          <div className='p-4 lg:pt-5'>
            <h2 className="text-neutral-slate100 font-semibold text-xl p-2">Your Results</h2>
            <p className='text-[#7C9AAC] text-base px-2'>Your results are shown below based on the information you provided. 
            To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div className='p-3 rounded-lg lg:mt-8 mt-4 border-t-4 border-primary-lime shadow-lg bg-[#0E2431] mb-4 mx-2'>
              <p className='text-[#7C9AAC] text-sm pb-2'>Your monthly repayments</p>
              <h3 className='text-primary-lime text-5xl font-bold py-2 px-3 mb-3'><FontAwesomeIcon icon={faSterlingSign} /> {monthlyPayment}</h3>
              <hr className='pt-5' />
              <p className='text-[#7C9AAC] text-sm pb-2'>Total you'll repay over the term</p>
              <h3 className='text-neutral-slate100 text-2xl font-bold'><FontAwesomeIcon icon={faSterlingSign} /> {totalPayment}</h3>
            </div>
          </div>
          <div className='text-center text-sm text-neutral-slate100 py-2 lg:mt-20 lg:text-xs'>
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" className='text-blue-500 text-base hover:underline lg:text-sm'>Frontend Mentor</a>. 
            Coded by <a href="https://github.com/JasperMunene" className='text-blue-500 text-base hover:underline lg:text-sm'>Jasper.</a>
          </div>
        </section>
      )}
    </main>
    
  );
}

export default App;
