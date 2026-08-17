import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { Calculator, RefreshCw, Sparkles } from 'lucide-react';

const BmiCalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      const rounded = parseFloat(bmiValue.toFixed(1));
      setBmi(rounded);

      if (rounded < 18.5) {
        setCategory('Underweight');
      } else if (rounded >= 18.5 && rounded < 25) {
        setCategory('Normal Weight');
      } else if (rounded >= 25 && rounded < 30) {
        setCategory('Overweight');
      } else {
        setCategory('Obese');
      }
    }
  };

  const resetForm = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory('');
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Normal Weight':
        return <Badge variant="success">Normal Weight</Badge>;
      case 'Underweight':
        return <Badge variant="warning">Underweight</Badge>;
      case 'Overweight':
        return <Badge variant="warning">Overweight</Badge>;
      case 'Obese':
        return <Badge variant="danger">Obese</Badge>;
      default:
        return <Badge variant="neutral">{cat}</Badge>;
    }
  };

  return (
    <>
      {/* Header Banner */}
      <section className="position-relative py-5 d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '30vh' }}>
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> BODY ANALYSIS
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>BMI Calculator</h1>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">BMI Calculator</span>
          </div>
        </div>
      </section>

      <section className="spad">
        <div className="container">
          <div className="row g-5">
            {/* Chart Reference Table */}
            <div className="col-lg-6">
              <div className="g-glass-card p-4 p-md-5 h-100">
                <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Body Reference</span>
                <h2 className="display-6 text-white fw-bold text-uppercase mt-2 mb-4" style={{ fontFamily: 'Oswald' }}>BMI Classification Chart</h2>
                <p className="text-secondary text-sm mb-4">
                  Body Mass Index (BMI) is a calculation based on height and weight to assess healthy body composition ranges.
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>BMI Range</TableHead>
                      <TableHead>Classification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-monospace text-warning">Below 18.5</TableCell>
                      <TableCell>Underweight</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-monospace text-success">18.5 – 24.9</TableCell>
                      <TableCell><span className="text-emerald-400 font-semibold">Normal Weight</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-monospace text-warning">25.0 – 29.9</TableCell>
                      <TableCell>Overweight</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-monospace text-danger">30.0 &amp; Above</TableCell>
                      <TableCell><span className="text-red-400 font-semibold">Obese</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Calculator Input Form */}
            <div className="col-lg-6">
              <div className="g-glass-card p-4 p-md-5 h-100">
                <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Personal Metric</span>
                <h2 className="display-6 text-white fw-bold text-uppercase mt-2 mb-4" style={{ fontFamily: 'Oswald' }}>Calculate Your BMI</h2>

                <form onSubmit={calculateBMI} className="d-flex flex-column gap-3">
                  <Input
                    label="Height (cm) *"
                    type="number"
                    required
                    min="50"
                    max="250"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />

                  <Input
                    label="Weight (kg) *"
                    type="number"
                    required
                    min="20"
                    max="300"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />

                  <div className="d-flex gap-3 mt-3">
                    <Button type="submit" variant="primary" fullWidth rightIcon={<Calculator size={16} />}>
                      Calculate
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} rightIcon={<RefreshCw size={16} />}>
                      Reset
                    </Button>
                  </div>
                </form>

                {bmi !== null && (
                  <div className="mt-4 p-4 rounded-3 text-center border border-white/10" style={{ background: 'rgba(243, 97, 0, 0.08)' }}>
                    <span className="text-secondary text-xs uppercase tracking-wider">Your Result</span>
                    <h2 className="display-4 text-white fw-bold my-1 g-gradient-text" style={{ fontFamily: 'Oswald' }}>
                      {bmi}
                    </h2>
                    <div className="mt-2">{getCategoryBadge(category)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BmiCalculator;
