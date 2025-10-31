import './Card.css';

export default function Card({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
      <span className="card-subtitle">{subtitle}</span>
    </div>
  );
}